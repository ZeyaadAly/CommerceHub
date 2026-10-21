'use client';

import * as Primitive from '@radix-ui/react-alert-dialog';
import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';

export const AlertDialog = Primitive.Root;
export const AlertDialogTrigger = Primitive.Trigger;
export const AlertDialogTitle = Primitive.Title;
export const AlertDialogDescription = Primitive.Description;
export const AlertDialogAction = Primitive.Action;
export const AlertDialogCancel = Primitive.Cancel;
export function AlertDialogContent({
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Overlay className="ch-overlay" />
      <Primitive.Content {...props} className={classes('ch-dialog', className)} />
    </Primitive.Portal>
  );
}
