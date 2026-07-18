import { Download, ExternalLink, FileText } from 'lucide-react';

export default function ResultFileLink({
  file,
  fallbackLabel,
  actionLabel,
  newTab = false,
}) {
  const href = file?.data || file?.url;
  const name = file?.name || fallbackLabel;
  const ActionIcon = newTab ? ExternalLink : Download;

  return (
    <a
      href={href}
      download={newTab ? undefined : name}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noreferrer' : undefined}
      aria-label={actionLabel ? `${actionLabel}: ${name}` : name}
      title={name}
      className="group flex min-h-14 min-w-0 items-center gap-2.5 rounded-2xl border border-border/70 bg-secondary/60 p-2 pe-2.5 text-start shadow-sm transition-[border-color,background-color,box-shadow] hover:border-[#00B59E]/35 hover:bg-[#D0F2EE]/45 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B59E]/30 dark:hover:bg-[#00B59E]/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D0F2EE] text-[#152B54] dark:bg-[#00B59E]/15 dark:text-[#00B59E]" aria-hidden="true">
        <FileText className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-navy" dir="auto">
        {name}
      </span>
      <span className="flex h-9 shrink-0 items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 text-[11px] font-semibold text-navy transition-colors group-hover:border-[#00B59E]/30" aria-hidden="true">
        <ActionIcon className="h-3.5 w-3.5" />
        {actionLabel && <span className="hidden min-[360px]:inline">{actionLabel}</span>}
      </span>
    </a>
  );
}
