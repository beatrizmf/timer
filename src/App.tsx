import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { CyclesProvider } from './hooks/useCycles'
import { Router } from './Router'

import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CyclesProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </CyclesProvider>

      <GlobalStyle />
    </ThemeProvider>
  )
}

export default App
