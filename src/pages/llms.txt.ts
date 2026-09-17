import type { APIRoute } from 'astro';

import {
  certifications,
  experienceTimeline,
  profile,
  skillGroups,
} from '../data/profile';
import { agentPaths, agentUrl, getAgentProjects } from '../lib/agent-surface';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getAgentProjects(site);
  const professional = projects.filter(
    (project) => project.lane === 'professional',
  );
  const personal = projects.filter((project) => project.lane === 'personal');

  const projectLine = (project: (typeof projects)[number]) =>
    `- [${project.title}](${project.markdownUrl}): ${project.summary} Stack: ${project.stack.join(', ')}. Period: ${project.period}.`;

  const body = [
    `# ${profile.name} — ${profile.jobTitle}`,
    '',
    `> ${profile.summary}`,
    '',
    profile.about,
    '',
    `Every project below links to a plain-Markdown mirror. A single-file dump of this whole portfolio is at [llms-full.txt](${agentUrl(agentPaths.llmsFullTxt, site)}), and a structured JSON version at [agent-index.json](${agentUrl(agentPaths.agentIndex, site)}).`,
    '',
    '## Professional projects',
    '',
    ...professional.map(projectLine),
    '',
    '## Personal projects',
    '',
    ...personal.map(projectLine),
    '',
    '## Experience',
    '',
    ...experienceTimeline.map(
      (item) => `- ${item.role} — ${item.company} (${item.period})`,
    ),
    '',
    '## Skills',
    '',
    ...skillGroups.map(
      (group) => `- ${group.title}: ${group.items.join(', ')}`,
    ),
    '',
    '## Certifications',
    '',
    ...certifications.map(
      (certification) =>
        `- [${certification.title}](${certification.credentialUrl ?? agentUrl('', site)}) — ${certification.issuer}, ${certification.issued}`,
    ),
    '',
    '## Contact',
    '',
    `- [Email](mailto:${profile.email})`,
    ...profile.links.map((link) => `- [${link.label}](${link.url})`),
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
