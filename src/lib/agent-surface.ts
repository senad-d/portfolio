import {
  certifications,
  coreTools,
  experienceTimeline,
  profile,
  skillGroups,
} from '../data/profile';
import { dateRange, getSortedProjects } from './projects';

/**
 * Shared machine-readable view of the portfolio, consumed by the agent
 * endpoints (`llms.txt`, `llms-full.txt`, `agent-index.json`, markdown
 * mirrors) and by the WebMCP tools registered in the browser.
 */

export const agentPaths = {
  llmsTxt: 'llms.txt',
  llmsFullTxt: 'llms-full.txt',
  agentIndex: 'agent-index.json',
  projectMarkdown: (slug: string) => `projects/${slug}.md`,
} as const;

/** Resolves a site-relative path against `base` and, when known, `site`. */
export const agentUrl = (path: string, site?: URL) => {
  const withBase = `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, '/');

  return site ? new URL(withBase, site).toString() : withBase;
};

export interface AgentProject {
  slug: string;
  title: string;
  summary: string;
  lane: 'professional' | 'personal';
  status: 'completed' | 'in-progress' | 'archived';
  featured: boolean;
  period: string;
  startDate: string;
  endDate: string;
  stack: string[];
  impact: string[];
  links: Record<string, string>;
  markdownUrl: string;
  body: string;
}

export const getAgentProjects = async (site?: URL): Promise<AgentProject[]> => {
  const projects = await getSortedProjects();

  return projects.map((project) => ({
    slug: project.id,
    title: project.data.title,
    summary: project.data.summary,
    lane: project.data.lane,
    status: project.data.status,
    featured: project.data.featured,
    period: dateRange(project.data.startDate, project.data.endDate),
    startDate: project.data.startDate,
    endDate: project.data.endDate,
    stack: project.data.stack,
    impact: project.data.impact,
    links: Object.fromEntries(
      Object.entries(project.data.links).filter(([, url]) => Boolean(url)),
    ) as Record<string, string>,
    markdownUrl: agentUrl(agentPaths.projectMarkdown(project.id), site),
    body: (project.body ?? '').trim(),
  }));
};

/** Full profile payload without project bodies, for `agent-index.json`. */
export const buildAgentIndex = async (site?: URL) => {
  const projects = await getAgentProjects(site);

  return {
    profile: {
      name: profile.name,
      jobTitle: profile.jobTitle,
      summary: profile.summary,
      about: profile.about,
      email: profile.email,
      links: profile.links,
      url: agentUrl('', site),
    },
    coreTools,
    skills: skillGroups.map((group) => ({
      group: group.title,
      items: group.items,
    })),
    experience: experienceTimeline,
    certifications,
    projects: projects.map((project) => ({
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      lane: project.lane,
      status: project.status,
      featured: project.featured,
      period: project.period,
      startDate: project.startDate,
      endDate: project.endDate,
      stack: project.stack,
      impact: project.impact,
      links: project.links,
      markdownUrl: project.markdownUrl,
    })),
    resources: {
      llmsTxt: agentUrl(agentPaths.llmsTxt, site),
      llmsFullTxt: agentUrl(agentPaths.llmsFullTxt, site),
      agentIndex: agentUrl(agentPaths.agentIndex, site),
    },
  };
};
