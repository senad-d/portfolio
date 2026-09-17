import type { APIRoute } from 'astro';

import { buildAgentIndex } from '../lib/agent-surface';

export const GET: APIRoute = async ({ site }) => {
  const index = await buildAgentIndex(site);

  return new Response(JSON.stringify(index, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
