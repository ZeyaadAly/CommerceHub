import type { ComponentProps, ReactNode } from 'react';
import { classes } from '../lib/classes.js';

export function Card(props: ComponentProps<'section'>) {
  return <section {...props} className={classes('ch-card', props.className)} />;
}

export function Badge({
  tone = 'neutral',
  ...props
}: ComponentProps<'span'> & { tone?: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return <span {...props} className={classes('ch-badge', props.className)} data-tone={tone} />;
}

export function Skeleton(props: Omit<ComponentProps<'div'>, 'children'>) {
  return <div {...props} aria-hidden="true" className={classes('ch-skeleton', props.className)} />;
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="ch-state">
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </section>
  );
}

export function ErrorPanel({
  title = 'Something went wrong',
  children,
  action,
}: {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="ch-state ch-error-panel" role="alert">
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </section>
  );
}
