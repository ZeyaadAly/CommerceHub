import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';

export function Table({ label, className, ...props }: ComponentProps<'table'> & { label: string }) {
  return (
    // A named scroll region needs a tab stop for keyboard scrolling across browsers.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="ch-table-region" role="region" aria-label={label} tabIndex={0}>
      <table {...props} className={classes('ch-table', className)} />
    </div>
  );
}
export function TableCaption(props: ComponentProps<'caption'>) {
  return <caption {...props} />;
}
export function TableHeader(props: ComponentProps<'thead'>) {
  return <thead {...props} />;
}
export function TableBody(props: ComponentProps<'tbody'>) {
  return <tbody {...props} />;
}
export function TableRow(props: ComponentProps<'tr'>) {
  return <tr {...props} />;
}
export function TableHead({ scope = 'col', ...props }: ComponentProps<'th'>) {
  return <th {...props} scope={scope} />;
}
export function TableCell(props: ComponentProps<'td'>) {
  return <td {...props} />;
}
