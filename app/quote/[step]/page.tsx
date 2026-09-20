import { QuizStepRunner } from '@/app/components/quote/QuizStepRunner'

export default async function Page(props: PageProps<'/quote/[step]'>) {
  const { step } = await props.params
  return <QuizStepRunner step={step} />
}
