import { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogClose,
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
  SkipLink,
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
  Tooltip,
  TooltipProvider,
} from '../../src/index.js';

export function Compositions() {
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(false);
  const [feedback, setFeedback] = useState('No changes made.');
  return (
    <TooltipProvider>
      <ToastProvider>
        <SkipLink />
        <main id="main" tabIndex={-1} className="fixture fixture-stack">
          <h1>Shared presentation review</h1>
          <p className="text-muted-foreground">
            Synthetic controls only. No commerce actions or API requests.
          </p>
          <Breadcrumb>
            <li>
              <NavigationLink href="#retail">Retail composition</NavigationLink>
            </li>
            <li>
              <NavigationLink href="#admin">Admin composition</NavigationLink>
            </li>
          </Breadcrumb>
          <Card id="retail" aria-labelledby="retail-title" className="fixture-stack">
            <h2 id="retail-title">Made for considered browsing</h2>
            <div className="fixture-retail">
              <div className="fixture-image" role="img" aria-label="Synthetic image placeholder">
                Image placeholder
              </div>
              <div className="fixture-stack">
                <Badge tone="success">Presentation ready</Badge>
                <h3>Readable, deliberate controls</h3>
                <p>Comfortable spacing and one clear action. This is not a product page.</p>
                <FormField
                  label="Display label"
                  helper="Synthetic text, saved locally in this fixture."
                  error={error}
                >
                  {(props) => (
                    <Input
                      {...props}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  )}
                </FormField>
                <div className="fixture-actions">
                  <Button
                    size="touch"
                    onClick={() => {
                      setError(name.trim() ? '' : 'Enter a display label.');
                      if (name.trim()) setToast(true);
                    }}
                  >
                    Preview action
                  </Button>
                  <Button variant="outline" size="touch">
                    Secondary action
                  </Button>
                  <Button variant="ghost">More information</Button>
                </div>
                <FormField label="Notes">
                  {(props) => <Textarea {...props} placeholder="Optional synthetic notes" />}
                </FormField>
                <FormField label="Display option">
                  {(props) => (
                    <Select defaultValue="first">
                      <SelectTrigger {...props}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First option</SelectItem>
                        <SelectItem value="second">Second option</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </FormField>
                <div className="fixture-check">
                  <Checkbox id="review-check" />
                  <label htmlFor="review-check">Include a visible selection mark</label>
                </div>
                <div className="fixture-check">
                  <Switch id="review-switch" />
                  <label htmlFor="review-switch">Enable synthetic preference</label>
                </div>
              </div>
            </div>
          </Card>
          <Card id="admin" aria-labelledby="admin-title" className="fixture-stack fixture-admin">
            <div className="fixture-toolbar">
              <div>
                <h2 id="admin-title">Presentation workspace</h2>
                <p className="text-muted-foreground">Compact rows, predictable actions.</p>
              </div>
              <div className="fixture-actions">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="compact">
                      <Plus aria-hidden="true" size={16} />
                      Edit sample
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Edit display label</DialogTitle>
                    <DialogDescription>Only this local fixture is affected.</DialogDescription>
                    <FormField label="Dialog label">
                      {(props) => <Input {...props} defaultValue="Example" />}
                    </FormField>
                    <Select defaultValue="one">
                      <SelectTrigger aria-label="Dialog option">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one">First dialog option</SelectItem>
                        <SelectItem value="two">Second dialog option</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="fixture-actions">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel edit</Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button onClick={() => setFeedback('Sample updated locally.')}>
                          Apply sample
                        </Button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconButton variant="outline" size="compact" label="Sample actions">
                      <MoreHorizontal aria-hidden="true" size={18} />
                    </IconButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setFeedback('First action selected.')}>
                      First action
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setFeedback('Second action selected.')}>
                      Second action
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>Unavailable action</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Table label="Synthetic sample rows">
              <TableCaption>Local sample entries</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['Alpha', 'Beta', 'Gamma'].map((label) => (
                  <TableRow key={label}>
                    <TableCell>{label}</TableCell>
                    <TableCell>
                      <Badge tone="warning">Review pending</Badge>
                    </TableCell>
                    <TableCell>Synthetic row {page}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} totalPages={3} onPageChange={setPage} />
            <p role="status">{feedback}</p>
            <div className="fixture-actions">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open navigation</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetTitle>Sample navigation</SheetTitle>
                  <SheetDescription>Fixture sections only.</SheetDescription>
                  <nav aria-label="Sample navigation">
                    <NavigationLink href="#retail">Retail section</NavigationLink>
                  </nav>
                </SheetContent>
              </Sheet>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Reset sample</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Reset this sample?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears the synthetic local label only.
                  </AlertDialogDescription>
                  <div className="fixture-actions">
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Keep sample</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setName('');
                          setFeedback('Sample reset locally.');
                        }}
                      >
                        Confirm reset
                      </Button>
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
              <Tooltip content="A named icon action">
                <IconButton label="Named icon action" variant="ghost">
                  <Plus aria-hidden="true" size={18} />
                </IconButton>
              </Tooltip>
            </div>
          </Card>
          <Card aria-label="Presentation states">
            <Tabs defaultValue="states">
              <TabsList aria-label="Example panels">
                <TabsTrigger value="states">States</TabsTrigger>
                <TabsTrigger value="settings">Other panel</TabsTrigger>
              </TabsList>
              <TabsContent value="states">
                <h2>State examples</h2>
                <div role="status">
                  <span className="ch-sr-only">Loading sample</span>
                  <Skeleton />
                </div>
                <div className="fixture-actions">
                  <Button loading>Loading action</Button>
                  <Button disabled>Unavailable action</Button>
                </div>
                <EmptyState title="No sample entries">Try another local view.</EmptyState>
                <ErrorPanel
                  action={
                    <Button
                      variant="outline"
                      onClick={() => setFeedback('Retry selected locally.')}
                    >
                      Retry sample
                    </Button>
                  }
                >
                  The sample could not be shown. No data was changed.
                </ErrorPanel>
              </TabsContent>
              <TabsContent value="settings">
                <h2>Another presentation panel</h2>
                <p>No hidden data queries.</p>
              </TabsContent>
            </Tabs>
          </Card>
          <Toast
            open={toast}
            onOpenChange={setToast}
            title="Sample label accepted"
            description="This confirmation is local to the fixture."
          />
          <ToastViewport />
        </main>
      </ToastProvider>
    </TooltipProvider>
  );
}
