// Filing status constants and utilities
export const FILING_STATUSES = {
  PENDING: 'pending',
  IN_REVIEW: 'in_review',
  IN_PROGRESS: 'in_progress',
  AWAITING_INFO: 'awaiting_info',
  READY_TO_FILE: 'ready_to_file',
  FILED: 'filed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type FilingStatus = typeof FILING_STATUSES[keyof typeof FILING_STATUSES];

interface StatusConfig {
  label: string;
  color: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function getStatusConfig(status: string): StatusConfig {
  const statusMap: Record<string, StatusConfig> = {
    [FILING_STATUSES.PENDING]: {
      label: 'Pending',
      color: 'bg-gray-100 text-gray-800',
      variant: 'secondary',
    },
    [FILING_STATUSES.IN_REVIEW]: {
      label: 'In Review',
      color: 'bg-blue-100 text-blue-800',
      variant: 'default',
    },
    [FILING_STATUSES.IN_PROGRESS]: {
      label: 'In Progress',
      color: 'bg-yellow-100 text-yellow-800',
      variant: 'outline',
    },
    [FILING_STATUSES.AWAITING_INFO]: {
      label: 'Awaiting Info',
      color: 'bg-orange-100 text-orange-800',
      variant: 'outline',
    },
    [FILING_STATUSES.READY_TO_FILE]: {
      label: 'Ready to File',
      color: 'bg-purple-100 text-purple-800',
      variant: 'default',
    },
    [FILING_STATUSES.FILED]: {
      label: 'Filed',
      color: 'bg-green-100 text-green-800',
      variant: 'default',
    },
    [FILING_STATUSES.COMPLETED]: {
      label: 'Completed',
      color: 'bg-green-200 text-green-900',
      variant: 'default',
    },
    [FILING_STATUSES.CANCELLED]: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800',
      variant: 'destructive',
    },
  };

  return statusMap[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800',
    variant: 'secondary',
  };
}
