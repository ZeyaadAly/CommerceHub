'use client';

import * as Primitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';
import type { ControlSize } from './button.js';

export const Select = Primitive.Root;
export const SelectValue = Primitive.Value;
export const SelectGroup = Primitive.Group;
export function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: ComponentProps<typeof Primitive.Trigger> & { size?: ControlSize }) {
  return (
    <Primitive.Trigger
      {...props}
      className={classes('ch-input ch-select-trigger', className)}
      data-size={size}
    >
      {children}
      <Primitive.Icon asChild>
        <ChevronDown aria-hidden="true" size={16} />
      </Primitive.Icon>
    </Primitive.Trigger>
  );
}
export function SelectContent({
  children,
  className,
  ...props
}: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        {...props}
        position="popper"
        sideOffset={6}
        collisionPadding={16}
        className={classes('ch-popover ch-select-content', className)}
      >
        <Primitive.ScrollUpButton className="ch-select-scroll">
          <ChevronUp aria-hidden="true" size={16} />
        </Primitive.ScrollUpButton>
        <Primitive.Viewport>{children}</Primitive.Viewport>
        <Primitive.ScrollDownButton className="ch-select-scroll">
          <ChevronDown aria-hidden="true" size={16} />
        </Primitive.ScrollDownButton>
      </Primitive.Content>
    </Primitive.Portal>
  );
}
export function SelectItem({
  children,
  className,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item {...props} className={classes('ch-menu-item', className)}>
      <Primitive.ItemText>{children}</Primitive.ItemText>
      <Primitive.ItemIndicator>
        <Check size={16} aria-hidden="true" />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  );
}
