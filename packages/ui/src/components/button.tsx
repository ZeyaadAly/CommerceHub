'use client';

import type { ButtonHTMLAttributes, Ref } from 'react';
import { LoaderCircle } from 'lucide-react';
import { classes } from '../lib/classes.js';

export type ControlSize = 'compact' | 'default' | 'touch';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: ControlSize;
  loading?: boolean;
};

export function Button({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes('ch-button', className)}
      data-variant={variant}
      data-size={size}
    >
      <span className="ch-button-label" style={{ visibility: loading ? 'hidden' : undefined }}>
        {children}
      </span>
      {loading ? <LoaderCircle className="ch-spinner" aria-hidden="true" /> : null}
      {loading ? <span className="ch-sr-only">{children}</span> : null}
    </button>
  );
}

export function IconButton({
  label,
  children,
  ...props
}: Omit<ButtonProps, 'aria-label'> & { label: string }) {
  return (
    <Button {...props} aria-label={label} className={classes('ch-icon-button', props.className)}>
      {children}
    </Button>
  );
}
