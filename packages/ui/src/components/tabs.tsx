'use client';

import * as Primitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';

export const Tabs = Primitive.Root;
export function TabsList(props: ComponentProps<typeof Primitive.List>) {
  return <Primitive.List {...props} className={classes('ch-tabs-list', props.className)} />;
}
export function TabsTrigger(props: ComponentProps<typeof Primitive.Trigger>) {
  return <Primitive.Trigger {...props} className={classes('ch-tabs-trigger', props.className)} />;
}
export function TabsContent(props: ComponentProps<typeof Primitive.Content>) {
  return <Primitive.Content {...props} className={classes('ch-tabs-content', props.className)} />;
}
