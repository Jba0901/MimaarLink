import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const SUCCESS_STATUSES = ['verified', 'approved', 'meeting_arranged', 'closed', 'bids_received'];

const statusBackground = (status) => {
  if (SUCCESS_STATUSES.includes(status)) return '#00B59E';
  if (status === 'cr_checked') return '#FFB638';
  if (status === 'suspended') return '#EF4444';
  return '#152B54';
};

export default function AdminStatusBadge({ status, className, children }) {
  const usesDarkText = SUCCESS_STATUSES.includes(status) || status === 'cr_checked';

  return (
    <Badge
      className={cn(
        'max-w-full shrink-0 border-transparent text-[11px] leading-4 shadow-none',
        usesDarkText ? 'text-[#152B54]' : 'text-white',
        className
      )}
      style={{ backgroundColor: statusBackground(status) }}
    >
      {children}
    </Badge>
  );
}
