import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'

import {
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import {
  Cycle,
  cyclesReducer,
  initialCyclesReducerState,
} from '../reducers/cycles/reducer'

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  hasActiveCycle: boolean
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  proxySetAmountSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateNewCycleData) => void
  interruptCurrentCycle: () => void
  markCurrentCycleAsFinished: () => void
}

const emptyCycleContextData = {} as CyclesContextType

const CyclesContext = createContext<CyclesContextType>(emptyCycleContextData)

interface CyclesProviderProps {
  children: ReactNode
}

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    initialCyclesReducerState,
  )

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const { cycles, activeCycleId } = cyclesState
  const hasActiveCycle = activeCycleId !== null
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function proxySetAmountSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateNewCycleData) {
    const { task, minutesAmount } = data

    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task,
      minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        hasActiveCycle,
        amountSecondsPassed,
        proxySetAmountSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        markCurrentCycleAsFinished,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles(): CyclesContextType {
  const context = useContext(CyclesContext)

  if (context === emptyCycleContextData) {
    throw new Error('useCycles must be used within a CyclesProvider')
  }

  return context
}
