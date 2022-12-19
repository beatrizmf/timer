import { useEffect } from 'react'

import { differenceInSeconds } from 'date-fns'

import { useCycles } from '../../../hooks/useCycles'

import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    proxySetAmountSecondsPassed,
  } = useCycles()

  const totalSeconds = activeCycle != null ? activeCycle.minutesAmount * 60 : 0

  const currentSeconds =
    activeCycle != null ? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number

    if (activeCycle != null) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDifference >= totalSeconds) {
          markCurrentCycleAsFinished()
          proxySetAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          proxySetAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    proxySetAmountSecondsPassed,
    markCurrentCycleAsFinished,
  ])

  useEffect(() => {
    if (activeCycle != null) {
      document.title = `${minutes}:${seconds} - ${activeCycle?.task} | Timer`
    } else {
      document.title = 'Timer'
    }
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
