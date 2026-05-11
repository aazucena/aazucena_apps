/** @shadcn standard component */
import { CircleNotch } from '@aazucena/icons';

import { cn } from '@aazucena/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <CircleNotch
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export { Spinner };
