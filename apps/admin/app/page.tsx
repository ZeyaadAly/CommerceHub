export default function AdminPage() {
  return (
    <main className="min-h-svh bg-slate-50 px-6 py-10 text-slate-950 sm:px-10">
      <section aria-labelledby="page-title" className="mx-auto w-full max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-blue-800">CommerceHub administration</p>
        <h1 id="page-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Admin foundation
        </h1>
        <p className="max-w-prose text-base leading-7 text-slate-700">
          The staff application workspace is ready for development.
          Administrative workflows and access controls are not available in this scaffold.
        </p>
        <p className="text-sm text-slate-600">CH-P0-003 · Local development scaffold</p>
      </section>
    </main>
  );
}
