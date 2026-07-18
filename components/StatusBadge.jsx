import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SUCCESS_STATUSES = [
  'verified',
  'approved',
  'contractors_invited',
  'bids_received',
  'shortlisted',
  'meeting_arranged',
  'closed',
];

const statusVariant = (status) => {
  if (SUCCESS_STATUSES.includes(status)) return 'success';
  if (status === 'cr_checked') return 'warning';
  if (status === 'suspended') return 'destructive';
  return 'default';
};

export default function StatusBadge({ status, className, children }) {
  return (
    <Badge
      variant={statusVariant(status)}
      className={cn('max-w-full shrink-0 break-words whitespace-normal text-start text-[12px] leading-4', className)}
    >
      {children}
    </Badge>
  );
}
