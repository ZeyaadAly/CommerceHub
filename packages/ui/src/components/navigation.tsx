'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { classes } from '../lib/classes.js';

export function SkipLink({
  href = '#main',
  children = 'Skip to content',
}: {
  href?: string;
  children?: ReactNode;
}) {
  return (
    <a className="ch-skip-link" href={href}>
      {children}
    </a>
  );
}
export function NavigationLink({
  current = false,
  children,
  ...props
}: ComponentProps<'a'> & { current?: boolean }) {
  return (
    <a
      {...props}
      aria-current={current ? 'page' : undefined}
      className={classes('ch-navigation-link', props.className)}
    >
      {children}
    </a>
  );
}
export function Breadcrumb({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="ch-breadcrumb">{children}</ol>
    </nav>
  );
}
export const TooltipProvider = TooltipPrimitive.Provider;
export function Tooltip({ children, content }: { children: ReactElement; content: string }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          collisionPadding={16}
          className="ch-popover ch-tooltip"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
