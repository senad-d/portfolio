import { getCollection } from 'astro:content';

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const toNormalizedProjectDate = (value: string) => {
  const isoDateMatch = value.match(/^(\d{4})-(0[1-9]|1[0-2])$/);

  if (isoDateMatch) {
    const [, year, month] = isoDateMatch;

    return {
      sortKey: `${year}-${month}`,
      label: `${monthLabels[Number(month) - 1]} ${year}`,
    };
  }

  const labelDateMatch = value.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/,
  );

  if (labelDateMatch) {
    const [, monthLabel, year] = labelDateMatch;
    const monthIndex =
      monthLabels.indexOf(monthLabel as (typeof monthLabels)[number]) + 1;

    return {
      sortKey: `${year}-${String(monthIndex).padStart(2, '0')}`,
      label: `${monthLabel} ${year}`,
    };
  }

  return { sortKey: '0000-00', label: value };
};

export const dateRange = (startDate: string, endDate: string) => {
  const start = toNormalizedProjectDate(startDate).label;
  const end =
    endDate.toLowerCase() === 'present'
      ? 'Present'
      : toNormalizedProjectDate(endDate).label;

  return `${start} — ${end}`;
};

/** Projects newest-first, the same order the rendered page uses. */
export const getSortedProjects = async () =>
  (await getCollection('projects')).sort((a, b) =>
    toNormalizedProjectDate(b.data.startDate).sortKey.localeCompare(
      toNormalizedProjectDate(a.data.startDate).sortKey,
    ),
  );
