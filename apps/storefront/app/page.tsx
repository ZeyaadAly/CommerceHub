export default function StorefrontPage() {
  return (
    <main className="flex min-h-svh items-center bg-slate-50 px-6 py-12 text-slate-950 sm:px-10">
      <section aria-labelledby="page-title" className="mx-auto w-full max-w-2xl space-y-5">
        <p className="text-sm font-semibold tracking-wide text-blue-800">CommerceHub</p>
        <h1 id="page-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Storefront foundation
        </h1>
        <p className="max-w-prose text-base leading-7 text-slate-700">
          The customer application workspace is ready for development.
          Shopping features will be added through separately reviewed stories.
        </p>
        <p className="text-sm text-slate-600">CH-P0-003 · Local development scaffold</p>
      </section>
    </main>
  );
}
