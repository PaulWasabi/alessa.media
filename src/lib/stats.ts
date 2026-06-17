export interface StatDef {
  label: string;
  base: number;
  /** How much the value grows for every full week since the anchor date. */
  perWeek: number;
}

export const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Date the base values are valid for: 2026-06-17 (UTC). */
export const STAT_ANCHOR_MS = Date.UTC(2026, 5, 17);

export const stats: StatDef[] = [
  { label: "TikTok / YouTube Shorts", base: 3500, perWeek: 10 },
  { label: "YouTube Videos", base: 170, perWeek: 2 },
  { label: "Podcast-Folgen", base: 130, perWeek: 0 },
];

/**
 * Current value of a stat: the base grows by `perWeek` for every full week
 * elapsed since the anchor. Partial weeks are ignored and dates before the
 * anchor never drop below the base.
 */
export function currentStatValue(
  stat: StatDef,
  nowMs: number,
  anchorMs: number = STAT_ANCHOR_MS,
): number {
  const weeks = Math.max(0, Math.floor((nowMs - anchorMs) / WEEK_MS));
  return stat.base + weeks * stat.perWeek;
}
