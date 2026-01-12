// Define enum types locally to avoid relying on Prisma generated types at build time
// These must match the Prisma schema exactly
export type Role = 'ADMIN' | 'STUDENT'
export type Track = 'SELF' | 'GROUP' | 'PREMIUM'
export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'LATE'
export type AssetType = 'TEMPLATE' | 'REPORT' | 'OTHER'
