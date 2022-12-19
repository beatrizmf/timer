import { zodResolver } from '@hookform/resolvers/zod'
import { Play, HandPalm } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'

import { Cycle, useCycles } from '../../hooks/useCycles'
import { Countdown } from './Countdown'
import { NewCycleForm } from './NewCycleForm'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Enter the task'),
  minutesAmount: zod
    .number()
    .min(5, 'The cycle must be a minimum of 5 minutes.')
    .max(60, 'The cycle must be a maximum of 60 minutes.'),
})

export type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const {
    interruptCurrentCycle,
    hasActiveCycle,
    createNewCycle,
    proxySetAmountSecondsPassed,
  } = useCycles()

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    createNewCycle(newCycle)
    proxySetAmountSecondsPassed(0)

    reset()
  }

  const task = watch('task')
  const isSubmitDisable = task.trim().length === 0

  function handleInterruptCycle() {
    interruptCurrentCycle()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {hasActiveCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interrupt
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Start
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
