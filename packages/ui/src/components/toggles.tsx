'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Check, Minus } from 'lucide-react';
import type { ComponentProps } from 'react';
import { classes } from '../lib/classes.js';

export function Checkbox({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root {...props} className={classes('ch-checkbox', className)}>
      <CheckboxPrimitive.Indicator className="ch-checkbox-indicator">
        <Check className="ch-check-icon" aria-hidden="true" />
        <Minus className="ch-mixed-icon" aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root {...props} className={classes('ch-switch', className)}>
      <SwitchPrimitive.Thumb className="ch-switch-thumb" />
    </SwitchPrimitive.Root>
  );
}
