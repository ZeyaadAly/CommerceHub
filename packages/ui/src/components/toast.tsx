'use client';

import * as Primitive from '@radix-ui/react-toast';
import type { ComponentProps, ReactNode } from 'react';
import { X } from 'lucide-react';
import { classes } from '../lib/classes.js';

export const ToastProvider = Primitive.Provider;
export function ToastViewport(props: ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport {...props} className={classes('ch-toast-viewport', props.className)} />
  );
}
export function Toast({
  title,
  description,
  children,
  ...props
}: Omit<ComponentProps<typeof Primitive.Root>, 'title'> & {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <Primitive.Root type="background" {...props} className={classes('ch-toast', props.className)}>
      <div>
        <Primitive.Title className="ch-toast-title">{title}</Primitive.Title>
        {description ? <Primitive.Description>{description}</Primitive.Description> : null}
        {children}
      </div>
      <Primitive.Close className="ch-overlay-close" aria-label="Dismiss notification">
        <X aria-hidden="true" size={16} />
      </Primitive.Close>
    </Primitive.Root>
  );
}
