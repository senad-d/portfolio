import type { APIRoute, GetStaticPaths } from 'astro';

import { buildCvPdf } from '../../lib/cv';
import { cvVariants, type CvVariant } from '../../lib/cv-variants';

export const getStaticPaths: GetStaticPaths = () =>
  cvVariants.map((variant) => ({
    params: { slug: variant.slug },
    props: { variant },
  }));

export const GET: APIRoute = async ({ props, site }) => {
  const { variant } = props as { variant: CvVariant };
  const pdf = await buildCvPdf(variant, site);

  return new Response(new Uint8Array(pdf), {
    headers: { 'content-type': 'application/pdf' },
  });
};
