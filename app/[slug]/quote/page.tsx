import { redirect } from 'next/navigation'

// Hardcoded rather than importing configs/cleaning.ts here: that module's
// import chain pulls in react-hook-form's Controller (client-only export),
// which breaks when resolved from a Server Component. Keep this in sync
// with cleaningConfig.initialStep in configs/cleaning.ts.
const CLEANING_INITIAL_STEP = 'service-type'

export default async function QuoteIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/${slug}/quote/${CLEANING_INITIAL_STEP}`)
}
