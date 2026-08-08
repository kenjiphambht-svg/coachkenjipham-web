import type { KnowledgeRootZone } from './contracts';

export const ESSENCE_DRIVE_ROOT_ID = '1bBKDZR-HTAr1bSgnex-DfvLUspMcfawY';

export type DriveRootPolicy = {
  folderId: string;
  title: string;
  rootZone: Exclude<KnowledgeRootZone, 'external'>;
  crawl: 'metadata_only' | 'content' | 'conditional' | 'deny';
};

export const ESSENCE_DRIVE_ROOTS: readonly DriveRootPolicy[] = [
  {
    folderId: '19W24RzG0ZUQy2kUrwiaUqLOJwR8PjgYJ',
    title: '00_BẮT ĐẦU Ở ĐÂY',
    rootZone: '00_start',
    crawl: 'metadata_only',
  },
  {
    folderId: '1yoB3Cx2h8ysVaFmk5WnpogIAHl0qnCbC',
    title: '01_ĐIỀU ĐANG ĐÚNG',
    rootZone: '01_current',
    crawl: 'content',
  },
  {
    folderId: '19_XFMNtqRd4k_KQhj9x01tTaKxi_YPHq',
    title: '02_CÔNG VIỆC ĐANG LÀM',
    rootZone: '02_work',
    crawl: 'content',
  },
  {
    folderId: '1cJZ2LA9wvQPOc7ik4whiZgiWpI6kVHZ5',
    title: '03_TRI THỨC ĐÃ CHƯNG CẤT',
    rootZone: '03_distilled',
    crawl: 'content',
  },
  {
    folderId: '1wBXJcUZeSDBfKx4d_kNPTe3gLBvnqviS',
    title: '04_NGUỒN VÀ LỊCH SỬ',
    rootZone: '04_history',
    crawl: 'conditional',
  },
  {
    folderId: '1mKF2nDA3kQOcnROy45Tpah_5bDvdEeCm',
    title: '90_QUẢN TRỊ THƯ VIỆN',
    rootZone: '90_governance',
    crawl: 'conditional',
  },
  {
    folderId: '1IlxV2oS1oVUVfL1NJ_Gx8AjMokCIwaZG',
    title: '99_KHO RIÊNG TƯ',
    rootZone: '99_private',
    crawl: 'deny',
  },
] as const;

const ROOT_BY_ID = new Map(ESSENCE_DRIVE_ROOTS.map((root) => [root.folderId, root]));

export function getDriveRootPolicy(folderId: string): DriveRootPolicy | null {
  return ROOT_BY_ID.get(folderId) ?? null;
}

export function resolveRootZoneFromAncestors(
  ancestorFolderIds: readonly string[]
): DriveRootPolicy | null {
  for (const folderId of ancestorFolderIds) {
    const root = ROOT_BY_ID.get(folderId);
    if (root) return root;
  }
  return null;
}

export function assertAllowedDriveRoot(folderId: string): DriveRootPolicy {
  const root = getDriveRootPolicy(folderId);
  if (!root || root.crawl === 'deny') {
    throw new Error('DRIVE_ROOT_NOT_ALLOWED');
  }
  return root;
}
