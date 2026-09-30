/**
 * CV download variants. Shared by the Contact section (links) and the PDF
 * endpoint (`src/pages/cv/[slug].pdf.ts`), so both stay in sync.
 *
 * `label` and `hint` are for the site cards only. `documentTitle` is what the
 * PDF itself shows (metadata and footer); it never says "professional".
 */

export type CvVariantId = 'professional' | 'full';

export interface CvVariant {
  id: CvVariantId;
  slug: string;
  label: string;
  hint: string;
  documentTitle: string;
  /**
   * canarytokens.org web bug requested when the card is clicked, so a download
   * sends an email alert. Public by design (it sits in the page HTML); the
   * private manage links live in `.local/canarytokens.md` (gitignored).
   */
  canaryUrl?: string;
}

export const cvVariants: CvVariant[] = [
  {
    id: 'professional',
    slug: 'senad-dizdarevic-cv',
    label: 'Professional CV',
    hint: 'Experience, education, skills, certifications, Projects',
    documentTitle: 'Curriculum Vitae',
    canaryUrl:
      'https://canarytokens.com/articles/traffic/kkps3qfmgojh8zn98ldytuq5r/post.jsp',
  },
  {
    id: 'full',
    slug: 'senad-dizdarevic-cv-full',
    label: 'Full CV',
    hint: 'Adds personal and open-source projects',
    documentTitle: 'Curriculum Vitae (extended)',
    canaryUrl:
      'https://canarytokens.com/feedback/b6g99b5pd1u1sqsjff675cwtc/index.html',
  },
];

export const cvPath = (variant: CvVariant) => `cv/${variant.slug}.pdf`;
