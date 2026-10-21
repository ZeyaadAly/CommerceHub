'use client';

import { useId } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { classes } from '../lib/classes.js';
import type { ControlSize } from './button.js';

export function Input({
  className,
  controlSize = 'default',
  ...props
}: ComponentProps<'input'> & { controlSize?: ControlSize }) {
  return <input {...props} className={classes('ch-input', className)} data-size={controlSize} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea {...props} className={classes('ch-input ch-textarea', className)} />;
}

type FieldControl = {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
  required: boolean;
};
export function FormField({
  id: providedId,
  label,
  helper,
  error,
  required = false,
  children,
}: {
  id?: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: (control: FieldControl) => ReactNode;
}) {
  const generated = useId();
  const id = providedId ?? generated;
  const descriptions =
    [helper ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;
  return (
    <div className="ch-field">
      <label htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children({ id, 'aria-describedby': descriptions, 'aria-invalid': Boolean(error), required })}
      {helper ? (
        <p id={`${id}-help`} className="ch-helper">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="ch-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
