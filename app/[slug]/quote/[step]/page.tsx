import { QuizStepRunner } from '../../../components/quote/QuizStepRunner'

export default async function Page({ params }: { params: Promise<{ slug: string; step: string }> }) {
  const { slug, step } = await params
  return <QuizStepRunner slug={slug} step={step} />
}
