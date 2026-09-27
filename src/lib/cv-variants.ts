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
}

export const cvVariants: CvVariant[] = [
  {
    id: 'professional',
    slug: 'senad-dizdarevic-cv',
    label: 'Professional CV',
    hint: 'Experience, education, skills, certifications, selected projects',
    documentTitle: 'Curriculum Vitae',
  },
  {
    id: 'full',
    slug: 'senad-dizdarevic-cv-full',
    label: 'Full CV',
    hint: 'Adds personal and open-source projects',
    documentTitle: 'Curriculum Vitae (extended)',
  },
];

export const cvPath = (variant: CvVariant) => `cv/${variant.slug}.pdf`;
