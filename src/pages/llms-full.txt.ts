import type { APIRoute } from 'astro';

import {
  certifications,
  coreTools,
  experienceTimeline,
  profile,
  skillGroups,
} from '../data/profile';
import { agentUrl, getAgentProjects } from '../lib/agent-surface';

export const GET: APIRoute = async ({ site }) => {
  const projects = await getAgentProjects(site);

  const projectBlock = (project: (typeof projects)[number]) =>
    [
      `## ${project.title}`,
      '',
      `- Slug: ${project.slug}`,
      `- Lane: ${project.lane}`,
      `- Status: ${project.status}`,
      `- Period: ${project.period}`,
      `- Stack: ${project.stack.join(', ')}`,
      `- Impact: ${project.impact.join(' | ')}`,
      ...Object.entries(project.links).map(
        ([label, url]) => `- Link (${label}): ${url}`,
      ),
      `- Markdown: ${project.markdownUrl}`,
      '',
      project.summary,
      '',
      project.body,
      '',
    ].join('\n');

  const body = [
    `# ${profile.name} — ${profile.jobTitle}`,
    '',
    `> ${profile.summary}`,
    '',
    profile.about,
    '',
    `Site: ${agentUrl('', site)}`,
    `Email: ${profile.email}`,
    ...profile.links.map((link) => `${link.label}: ${link.url}`),
    '',
    '# Experience',
    '',
    ...experienceTimeline.flatMap((item) => [
      `## ${item.role} — ${item.company}`,
      '',
      `Period: ${item.period}`,
      '',
      ...item.highlights.map((highlight) => `- ${highlight}`),
      '',
    ]),
    '# Skills',
    '',
    `Core tools: ${coreTools.join(', ')}`,
    '',
    ...skillGroups.flatMap((group) => [
      `## ${group.title}`,
      '',
      ...group.items.map((item) => `- ${item}`),
      '',
    ]),
    '# Certifications',
    '',
    ...certifications.flatMap((certification) => [
      `## ${certification.title}`,
      '',
      `- Issuer: ${certification.issuer}`,
      `- Issued: ${certification.issued}`,
      `- Credential ID: ${certification.credentialId}`,
      ...(certification.credentialUrl
        ? [`- Verify: ${certification.credentialUrl}`]
        : []),
      '',
    ]),
    '# Projects',
    '',
    ...projects.map(projectBlock),
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
