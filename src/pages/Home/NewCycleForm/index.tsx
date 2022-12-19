import { useFormContext } from 'react-hook-form'

import { useCycles } from '../../../hooks/useCycles'

import { FormContainer, MinutesAmountInput, TaskInput } from './styles'

export function NewCycleForm() {
  const { hasActiveCycle } = useCycles()

  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">I am going to work in</label>
      <TaskInput
        id="task"
        list="task-suggestions"
        placeholder="your task"
        disabled={hasActiveCycle}
        {...register('task')}
      />

      <datalist id="task-suggestions">
        <option value="task 1" />
        <option value="task 2" />
        <option value="task 3" />
      </datalist>

      <label htmlFor="minutesAmount">during</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={hasActiveCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutes.</span>
    </FormContainer>
  )
}
