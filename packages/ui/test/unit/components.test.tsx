import { useState } from 'react';
import type { FormEvent } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  ErrorPanel,
  FormField,
  IconButton,
  Input,
  NavigationLink,
  Pagination,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Toast,
  ToastProvider,
  ToastViewport,
} from '../../src/index.js';

afterEach(cleanup);

describe('activation and fields', () => {
  it('does not accidentally submit forms; disabled and pending actions cannot fire', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={submit}>
        <Button onClick={click}>Run action</Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Run action' }));
    expect(click).toHaveBeenCalledTimes(1);
    expect(submit).not.toHaveBeenCalled();
    rerender(
      <Button disabled onClick={click}>
        Run action
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledTimes(1);
    rerender(
      <Button loading onClick={click}>
        Run action
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Run action' }).getAttribute('aria-busy')).toBe(
      'true',
    );
    await user.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledTimes(1);
  });
  it('keeps all variants named and supports idiomatic refs', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <>
        {(['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
        <IconButton ref={ref} label="Open actions">
          <span aria-hidden="true">+</span>
        </IconButton>
      </>,
    );
    expect(screen.getAllByRole('button')).toHaveLength(6);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Open actions' }));
  });
  it('associates visible label, helper and live validation with the exact input', () => {
    const { rerender } = render(
      <FormField label="Label" helper="Helpful guidance">
        {(props) => <Input {...props} />}
      </FormField>,
    );
    const input = screen.getByLabelText('Label');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    rerender(
      <FormField label="Label" helper="Helpful guidance" error="Enter a label.">
        {(props) => <Input {...props} />}
      </FormField>,
    );
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Helpful guidance',
      'Enter a label.',
    ]);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toBe('Enter a label.');
  });
  it('uses unique field ids and supports controlled text without losing input on errors', async () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <>
          <FormField label="First">
            {(props) => (
              <Input {...props} value={value} onChange={(event) => setValue(event.target.value)} />
            )}
          </FormField>
          <FormField label="Second" error="Review this value.">
            {(props) => <Textarea {...props} defaultValue="Preserved" />}
          </FormField>
        </>
      );
    }
    render(<Controlled />);
    await userEvent.setup().type(screen.getByLabelText('First'), 'Typed label');
    expect(screen.getByLabelText<HTMLInputElement>('First').value).toBe('Typed label');
    expect(screen.getByLabelText<HTMLTextAreaElement>('Second').value).toBe('Preserved');
    expect(screen.getByLabelText('First').id).not.toBe(screen.getByLabelText('Second').id);
  });
  it('supports checked, mixed and disabled checkbox semantics', async () => {
    const change = vi.fn();
    const { rerender } = render(<Checkbox aria-label="Sample checkbox" onCheckedChange={change} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.setup().click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(change).toHaveBeenCalledWith(true);
    rerender(
      <Checkbox
        aria-label="Sample checkbox"
        checked="indeterminate"
        disabled
        onCheckedChange={change}
      />,
    );
    expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    await userEvent.setup().click(checkbox);
    expect(change).toHaveBeenCalledTimes(1);
  });
  it('switch supports keyboard toggling and controlled state', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Switch aria-label="Sample switch" checked={checked} onCheckedChange={setChecked} />;
    }
    render(<Controlled />);
    const control = screen.getByRole('switch');
    control.focus();
    await userEvent.setup().keyboard(' ');
    expect(control.getAttribute('aria-checked')).toBe('true');
  });
});

describe('overlays and selection', () => {
  it('dialog has a title/description, contains focus, closes on Escape and restores trigger', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Example dialog</DialogTitle>
          <DialogDescription>Local content</DialogDescription>
          <Input aria-label="Dialog input" />
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole('button', { name: 'Open dialog' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Example dialog' });
    expect(
      document.getElementById(dialog.getAttribute('aria-describedby') ?? '')?.textContent,
    ).toBe('Local content');
    for (let i = 0; i < 5; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it('confirmation initially focuses the safe cancel action', async () => {
    const confirm = vi.fn();
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Reset</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Reset sample?</AlertDialogTitle>
          <AlertDialogDescription>Local sample only.</AlertDialogDescription>
          <AlertDialogCancel asChild>
            <Button>Keep sample</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={confirm}>Confirm reset</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Keep sample' }));
    await user.keyboard('{Escape}');
    expect(confirm).not.toHaveBeenCalled();
  });
  it('sheet uses modal dialog semantics and the shared close control', async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open sheet</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Section navigation</SheetTitle>
          <SheetDescription>Local sections.</SheetDescription>
          <NavigationLink href="#one">One</NavigationLink>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole('button', { name: 'Open sheet' }));
    expect(screen.getByRole('dialog', { name: 'Section navigation' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('tabs use arrow navigation and associate the active panel', async () => {
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Panels">
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First panel</TabsContent>
        <TabsContent value="two">Second panel</TabsContent>
      </Tabs>,
    );
    screen.getByRole('tab', { name: 'One' }).focus();
    await userEvent.setup().keyboard('{ArrowRight}');
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: 'Two' }).getAttribute('aria-selected')).toBe('true'),
    );
    expect(screen.getByRole('tabpanel').textContent).toBe('Second panel');
  });
  it('menu keyboard selects one enabled action and restores focus', async () => {
    const select = vi.fn();
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={select}>First</DropdownMenuItem>
          <DropdownMenuItem disabled>Unavailable</DropdownMenuItem>
          <DropdownMenuItem onSelect={select}>Last</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('menu');
    await user.keyboard('{End}{Enter}');
    expect(select).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
  it('select exposes its label and current value before interaction', () => {
    render(
      <Select defaultValue="one">
        <SelectTrigger aria-label="Option">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="one">One</SelectItem>
          <SelectItem value="two">Two</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox', { name: 'Option' }).textContent).toBe('One');
  });
});

describe('presentation contracts', () => {
  it('table retains caption, column headers, rows and a named scroll region', () => {
    render(
      <Table label="Sample table">
        <TableCaption>Sample rows</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alpha</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(
      within(screen.getByRole('region', { name: 'Sample table' })).getByRole('table', {
        name: 'Sample rows',
      }),
    ).toBeTruthy();
    expect(screen.getByRole('columnheader').getAttribute('scope')).toBe('col');
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
  it('pagination is controlled, preserves current page and disables boundary navigation', async () => {
    const change = vi.fn();
    const { rerender } = render(<Pagination page={1} totalPages={2} onPageChange={change} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(change).toHaveBeenCalledWith(2);
    expect(screen.getByText('Page 1 of 2').getAttribute('aria-current')).toBe('page');
    rerender(<Pagination page={2} totalPages={2} onPageChange={change} />);
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Next' }).disabled).toBe(true);
  });
  it('error and empty states have distinct semantics and preserve retry intent', async () => {
    const retry = vi.fn();
    render(
      <>
        <EmptyState title="No entries">Nothing yet.</EmptyState>
        <ErrorPanel action={<Button onClick={retry}>Retry</Button>}>
          Request failed safely.
        </ErrorPanel>
        <Badge tone="success">Complete</Badge>
      </>,
    );
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert').textContent).toContain('Request failed safely.');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Retry' }));
    expect(retry).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Complete')).toBeTruthy();
  });
  it('skeleton is decorative, so a caller owns one loading announcement', () => {
    const { container } = render(
      <div role="status">
        Loading sample
        <Skeleton />
      </div>,
    );
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
  it('toast provides named content and a dismiss action within its own provider', async () => {
    render(
      <ToastProvider>
        <Toast defaultOpen title="Sample accepted" description="Local confirmation." />
        <ToastViewport />
      </ToastProvider>,
    );
    expect(await screen.findByText('Sample accepted')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByText('Sample accepted')).toBeNull());
  });
});
