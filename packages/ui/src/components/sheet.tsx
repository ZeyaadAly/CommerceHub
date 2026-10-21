'use client';

import type { ComponentProps } from 'react';
import { DialogContent } from './dialog.js';
import { classes } from '../lib/classes.js';
export {
  Dialog as Sheet,
  DialogTrigger as SheetTrigger,
  DialogClose as SheetClose,
  DialogTitle as SheetTitle,
  DialogDescription as SheetDescription,
} from './dialog.js';
export function SheetContent({ className, ...props }: ComponentProps<typeof DialogContent>) {
  return <DialogContent {...props} className={classes('ch-sheet', className)} />;
}
