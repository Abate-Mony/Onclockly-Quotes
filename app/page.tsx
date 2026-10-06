// Every real entry point to this app is company-scoped (/<slug>, see
// app/[slug]/layout.tsx) — a request to bare "/" has no company to show a
// quote wizard for, so this is just a short explainer rather than a 404.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <h1 className="font-serif text-2xl font-semibold text-foreground">This link needs a company</h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Quote request links look like <code className="rounded bg-muted px-1.5 py-0.5 text-xs">/your-company-link</code>.
        Ask the company you&rsquo;re requesting a quote from for their link.
      </p>
    </main>
  )
}
