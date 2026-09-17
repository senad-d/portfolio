import type { APIRoute, GetStaticPaths } from 'astro';

import { getAgentProjects } from '../../lib/agent-surface';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getAgentProjects();

  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const { project } = props as {
    project: Awaited<ReturnType<typeof getAgentProjects>>[number];
  };

  const body = [
    `# ${project.title}`,
    '',
    `> ${project.summary}`,
    '',
    `- Lane: ${project.lane}`,
    `- Status: ${project.status}`,
    `- Period: ${project.period}`,
    `- Stack: ${project.stack.join(', ')}`,
    ...project.impact.map((impact) => `- Impact: ${impact}`),
    ...Object.entries(project.links).map(
      ([label, url]) => `- Link (${label}): ${url}`,
    ),
    '',
    project.body,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
};
