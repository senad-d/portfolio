import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import pdfmake from 'pdfmake';
import type {
  Content,
  ContentStack,
  CustomTableLayout,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';

import {
  certifications,
  coreTools,
  education,
  experienceTimeline,
  languages,
  personalDetails,
  profile,
  skillGroups,
} from '../data/profile';
import { agentUrl, getAgentProjects, type AgentProject } from './agent-surface';
import type { CvVariant } from './cv-variants';

/**
 * Build-time CV renderer. Both variants read the same profile data and
 * project collection as the page, so the PDFs never drift from the site.
 *
 * Section order follows the conventional European CV: header with personal
 * details, profile, work experience, education, certifications, skills,
 * languages, Projects. The `full` variant appends the personal and
 * open-source project lane. Sections without data are left out.
 */

/**
 * Impact bullets kept per personal project. Zero keeps the full CV practical:
 * title, period, summary, stack, and links only.
 */
const personalImpactLimit = 0;

/** Profile links (by label) shown in the CV header; the rest stay on the site only. */
const cvLinkLabels = new Set(['GitHub']);

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, '');

/** Hosts of the hidden profile links; project references to them are hidden too. */
const hiddenLinkHosts = new Set(
  profile.links
    .filter((item) => !cvLinkLabels.has(item.label))
    .map((item) => hostOf(item.url)),
);

const color = {
  text: '#111827',
  muted: '#4b5563',
  accent: '#0e7490',
  rule: '#cbd5e1',
  headerFill: '#f1f5f9',
} as const;

const page = {
  width: 595.28, // A4 portrait, pt
  margins: [44, 40, 44, 52] as [number, number, number, number],
};

const contentWidth = page.width - page.margins[0] - page.margins[2];

/**
 * Fonts live in the repo (SIL OFL) because the built-in PDF fonts cannot render
 * Latin Extended glyphs such as the "ć" in the profile name. They are resolved
 * from the project root because `astro build` runs there.
 */
const fontDir = resolve(process.cwd(), 'src/assets/fonts/inter');

/**
 * Header photo: a 360px JPEG copy of `public/senad.png` so the PDF stays small.
 * Regenerate with:
 * `sips -s format jpeg -s formatOptions 85 -Z 360 --out src/assets/cv/senad-photo.jpg public/senad.png`
 * It is passed as a data URL, which pdfmake accepts without a file access policy.
 */
const photoPath = resolve(process.cwd(), 'src/assets/cv/senad-photo.jpg');
const photoWidth = 96;

const photoDataUrl = () =>
  `data:image/jpeg;base64,${readFileSync(photoPath).toString('base64')}`;

let fontsRegistered = false;

const registerFonts = () => {
  if (fontsRegistered) {
    return;
  }

  const regular = resolve(fontDir, 'Inter-Regular.ttf');
  const semiBold = resolve(fontDir, 'Inter-SemiBold.ttf');

  pdfmake.setFonts({
    Inter: {
      normal: regular,
      bold: semiBold,
      italics: regular,
      bolditalics: semiBold,
    },
  });
  // Only the bundled fonts may be read from disk; remote fetches are denied.
  pdfmake.setLocalAccessPolicy((path) => path.startsWith(fontDir));
  pdfmake.setUrlAccessPolicy(() => false);

  fontsRegistered = true;
};

const stripUrl = (url: string) =>
  url
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');

/** Long or opaque URLs (for example Upwork ids) read better as a short label. */
const shortUrl = (url: string) => {
  const short = stripUrl(url);

  return short.length <= 40 ? short : 'Profile link';
};

const link = (text: string, url: string): Content => ({
  text,
  link: url,
  color: color.accent,
});

/** Borderless table used as a label/value grid: a gap after every column but the last. */
const gridLayout = (rowGap: number, columnGap: number): CustomTableLayout => ({
  hLineWidth: () => 0,
  vLineWidth: () => 0,
  paddingLeft: () => 0,
  paddingRight: (i, node) =>
    i < (node.table.widths?.length ?? 0) - 1 ? columnGap : 0,
  paddingTop: () => rowGap,
  paddingBottom: () => rowGap,
});

/** Borderless table used as a filled card: outer padding on the outer edges, a gap between cells. */
const cardLayout = (padding: { x: number; y: number }): CustomTableLayout => ({
  hLineWidth: () => 0,
  vLineWidth: () => 0,
  paddingLeft: (i) => (i === 0 ? padding.x : padding.x / 2),
  paddingRight: (i, node) =>
    i === (node.table.widths?.length ?? 1) - 1 ? padding.x : padding.x / 2,
  paddingTop: () => padding.y,
  paddingBottom: () => padding.y,
});

const sectionTitle = (title: string): Content => ({
  stack: [
    { text: title.toUpperCase(), style: 'sectionTitle' },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: contentWidth,
          y2: 0,
          lineWidth: 0.8,
          lineColor: color.rule,
        },
      ],
      margin: [0, 3, 0, 0],
    },
  ],
  headlineLevel: 1,
  margin: [0, 12, 0, 6],
});

/** A section only when it has entries, so empty data never leaves a heading. */
const optionalSection = (title: string, entries: Content[]): Content[] =>
  entries.length ? [sectionTitle(title), ...entries] : [];

const entryHeading = (
  title: string,
  subtitle: string | undefined,
  period: string,
): Content => ({
  columns: [
    {
      width: '*',
      stack: [
        { text: title, style: 'entryTitle' },
        ...(subtitle ? [{ text: subtitle, style: 'entrySubtitle' }] : []),
      ],
    },
    { width: 'auto', text: period, style: 'period' },
  ],
  columnGap: 12,
});

/**
 * pdfmake rewrites list arrays in place (each string becomes a text node), so
 * the caller's array is copied. Passing shared profile or content-collection
 * arrays directly would corrupt the page and agent endpoints rendered later in
 * the same build.
 */
const bullets = (items: string[]): Content => ({
  ul: [...items],
  margin: [0, 3, 0, 0],
});

const entry = (parts: Content[]): ContentStack => ({
  stack: parts,
  unbreakable: true,
  margin: [0, 0, 0, 8],
});

/* ── Header card ─────────────────────────────────────────────────────── */

interface Detail {
  label: string;
  value: string;
  url?: string;
}

const detail = (label: string, value: string, url?: string): Detail[] =>
  value ? [{ label, value, url }] : [];

const personalColumn = (): Detail[] => [
  ...detail('Email', profile.email, `mailto:${profile.email}`),
  ...detail(
    'Phone',
    personalDetails.phone,
    `tel:${personalDetails.phone.replace(/[^+\d]/g, '')}`,
  ),
  ...detail('Location', personalDetails.location),
  ...detail('Date of birth', personalDetails.dateOfBirth),
  ...detail('Nationality', personalDetails.nationality),
  ...detail('Driving licence', personalDetails.drivingLicence),
  ...detail('Availability', personalDetails.availability),
];

const onlineColumn = (siteUrl: string): Detail[] => [
  ...detail('Website', stripUrl(siteUrl), siteUrl),
  ...profile.links
    .filter((item) => cvLinkLabels.has(item.label))
    .flatMap((item) => detail(item.label, shortUrl(item.url), item.url)),
];

const detailValue = (item: Detail): Content => ({
  text: item.value,
  style: 'detailValue',
  ...(item.url ? { link: item.url, color: color.accent } : {}),
});

/** Label/value rows for the personal details on the left of the header. */
const detailsGrid = (items: Detail[]): Content => ({
  table: {
    widths: [58, '*'],
    body: items.map((item) => [
      { text: item.label, style: 'detailLabel' },
      detailValue(item),
    ]),
  },
  layout: gridLayout(1.5, 10),
  margin: [0, 10, 0, 0],
});

/** Photo with the online links right-aligned under it; the cell sits at the card bottom. */
const photoCell = (siteUrl: string): ContentStack => ({
  stack: [
    { image: 'photo', width: photoWidth, alignment: 'right' },
    ...onlineColumn(siteUrl).map(
      (item, index): Content => ({
        text: [
          { text: `${item.label}  `, style: 'detailLabel' },
          detailValue(item),
        ],
        alignment: 'right',
        margin: [0, index === 0 ? 8 : 2, 0, 0],
      }),
    ),
  ],
});

const headerCard = (siteUrl: string): Content => ({
  table: {
    widths: ['*', 170],
    body: [
      [
        {
          fillColor: color.headerFill,
          stack: [
            { text: profile.name, style: 'name' },
            { text: profile.jobTitle, style: 'jobTitle' },
            detailsGrid(personalColumn()),
          ],
        },
        {
          fillColor: color.headerFill,
          verticalAlignment: 'bottom',
          ...photoCell(siteUrl),
        },
      ],
    ],
  },
  layout: cardLayout({ x: 16, y: 14 }),
  unbreakable: true,
});

/* ── Sections ────────────────────────────────────────────────────────── */

const experienceEntries = (): Content[] =>
  experienceTimeline.map((item) =>
    entry([
      entryHeading(item.role, item.company, item.period),
      bullets(item.highlights),
    ]),
  );

const educationEntries = (): Content[] =>
  education.map((item) =>
    entry([
      entryHeading(item.degree, item.institution, item.period),
      ...(item.note
        ? [{ text: item.note, margin: [0, 2, 0, 0] } as Content]
        : []),
    ]),
  );

const certificationEntries = (): Content[] =>
  certifications.map((certification) =>
    entry([
      entryHeading(
        certification.title,
        `${certification.issuer} · Credential ID ${certification.credentialId}`,
        certification.issued,
      ),
      ...(certification.credentialUrl
        ? [
            {
              text: link('Verify credential', certification.credentialUrl),
              style: 'meta',
              margin: [0, 2, 0, 0],
            } as Content,
          ]
        : []),
    ]),
  );

const skillsTable = (): Content => ({
  table: {
    widths: [130, '*'],
    body: [
      [{ text: 'Core tools', bold: true }, coreTools.join(', ')],
      ...skillGroups.map((group) => [
        { text: group.title, bold: true },
        group.items.join(', '),
      ]),
    ],
  },
  layout: gridLayout(2, 10),
});

const languageEntries = (): Content[] =>
  languages.length
    ? [
        {
          text: languages
            .map((language) => `${language.name} — ${language.level}`)
            .join('   ·   '),
        },
      ]
    : [];

const projectLinkLabels: Record<string, string> = {
  github: 'GitHub',
  npm: 'npm',
  live: 'Live',
  caseStudy: 'Reference',
};

const projectEntry = (project: AgentProject, impactLimit?: number): Content => {
  const links = Object.entries(project.links)
    .filter(([, url]) => !hiddenLinkHosts.has(hostOf(url)))
    .flatMap(([key, url], index) => [
      ...(index > 0 ? [' · '] : []),
      `${projectLinkLabels[key] ?? key}: `,
      link(stripUrl(url), url),
    ]);

  const impact =
    impactLimit === undefined
      ? project.impact
      : project.impact.slice(0, impactLimit);

  return entry([
    entryHeading(project.title, undefined, project.period),
    { text: project.summary, margin: [0, 2, 0, 0] },
    ...(impact.length ? [bullets(impact)] : []),
    {
      text: [{ text: 'Stack: ', bold: true }, project.stack.join(', ')],
      style: 'meta',
      margin: [0, 3, 0, 0],
    },
    ...(links.length ? [{ text: links, style: 'meta' } as Content] : []),
  ]);
};

/* ── Document ────────────────────────────────────────────────────────── */

const buildDefinition = (
  variant: CvVariant,
  projects: AgentProject[],
  siteUrl: string,
): TDocumentDefinitions => {
  const selected = projects.filter(
    (project) => project.lane === 'professional',
  );
  const personal = projects.filter((project) => project.lane === 'personal');
  const updatedOn = new Date().toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });

  const content: Content[] = [
    headerCard(siteUrl),

    sectionTitle('Profile'),
    { text: profile.summary },
    { text: profile.about, margin: [0, 4, 0, 0] },

    sectionTitle('Work experience'),
    ...experienceEntries(),

    ...optionalSection('Education', educationEntries()),
    ...optionalSection('Certifications', certificationEntries()),

    sectionTitle('Skills'),
    skillsTable(),

    ...optionalSection('Languages', languageEntries()),

    sectionTitle('Projects'),
    ...selected.map((project) => projectEntry(project)),
  ];

  if (variant.id === 'full') {
    content.push(
      sectionTitle('Personal and open-source projects'),
      ...personal.map((project) => projectEntry(project, personalImpactLimit)),
    );
  }

  return {
    pageSize: 'A4',
    pageMargins: page.margins,
    info: {
      title: `${profile.name} — ${variant.documentTitle}`,
      author: profile.name,
      subject: `${variant.documentTitle} — ${profile.jobTitle}`,
      keywords: coreTools.join(', '),
      creator: stripUrl(siteUrl),
    },
    content,
    images: { photo: photoDataUrl() },
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: `${profile.name} · ${variant.documentTitle} · updated ${updatedOn} · ${stripUrl(siteUrl)}`,
          style: 'footer',
        },
        {
          width: 'auto',
          text: `Page ${currentPage} of ${pageCount}`,
          style: 'footer',
        },
      ],
      margin: [page.margins[0], 18, page.margins[2], 0],
    }),
    // Never leave a section title stranded at the bottom of a page.
    pageBreakBefore: (node, { getFollowingNodesOnPage }) =>
      node.headlineLevel === 1 && getFollowingNodesOnPage().length === 0,
    defaultStyle: {
      font: 'Inter',
      fontSize: 9.5,
      color: color.text,
      lineHeight: 1.3,
    },
    styles: {
      name: { fontSize: 22, bold: true, lineHeight: 1.1 },
      jobTitle: {
        fontSize: 11.5,
        bold: true,
        color: color.accent,
        margin: [0, 3, 0, 0],
      },
      detailLabel: { fontSize: 8, color: color.muted },
      detailValue: { fontSize: 9 },
      meta: { fontSize: 8.5, color: color.muted, lineHeight: 1.3 },
      sectionTitle: {
        fontSize: 9.5,
        bold: true,
        color: color.accent,
        characterSpacing: 1,
      },
      entryTitle: { fontSize: 10.5, bold: true },
      entrySubtitle: { fontSize: 9, color: color.muted },
      period: { fontSize: 8.5, color: color.muted, alignment: 'right' },
      footer: { fontSize: 7.5, color: color.muted },
    },
  };
};

/** Renders one CV variant to a PDF buffer. */
export const buildCvPdf = async (
  variant: CvVariant,
  site?: URL,
): Promise<Buffer> => {
  registerFonts();

  const projects = await getAgentProjects(site);
  const definition = buildDefinition(variant, projects, agentUrl('', site));

  return pdfmake.createPdf(definition).getBuffer();
};
