import { createContext, ReactNode, useContext, useState } from 'react'

interface CreateNewCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id?: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
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
  const [cycles, setCycles] = useState<Cycle[]>([])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const hasActiveCycle = activeCycle !== undefined

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

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

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
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
