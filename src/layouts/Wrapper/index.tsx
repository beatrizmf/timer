import { Outlet } from 'react-router-dom'

import { Header } from '../../components/Header'

import { WrapperContainer } from './styles'

export function Wrapper() {
  return (
    <WrapperContainer>
      <Header />
      <Outlet />
    </WrapperContainer>
  )
}
