import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const NativeSelect = React.forwardRef(({
  className,
  wrapperClassName,
  children,
  ...props
}, ref) => (
  <div className={cn('relative', wrapperClassName)}>
    <select
      ref={ref}
      className={cn(
        'min-h-11 w-full appearance-none rounded-xl border border-input bg-card ps-3.5 pe-10 text-start text-base text-foreground shadow-soft ring-offset-background transition-[border-color,box-shadow,background-color] hover:border-[#00B59E]/45 focus:border-[#00B59E]/60 focus:outline-none focus:ring-2 focus:ring-[#00B59E]/25 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [@media(pointer:coarse)]:!text-base',
        className,
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
  </div>
));

NativeSelect.displayName = 'NativeSelect';

export default NativeSelect;
