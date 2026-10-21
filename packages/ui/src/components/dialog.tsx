'use client';

import * as Primitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';

export const Dialog = Primitive.Root;
export const DialogTrigger = Primitive.Trigger;
export const DialogClose = Primitive.Close;
export const DialogTitle = Primitive.Title;
export const DialogDescription = Primitive.Description;
export function DialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="ch-overlay" />
      <Primitive.Content {...props} className={classes('ch-dialog', className)}>
        {children}
        <Primitive.Close className="ch-overlay-close" aria-label="Close dialog">
          <X aria-hidden="true" size={18} />
        </Primitive.Close>
      </Primitive.Content>
    </Primitive.Portal>
  );
}
