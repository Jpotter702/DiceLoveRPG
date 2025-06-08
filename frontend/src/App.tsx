import { Outlet } from 'react-router-dom'
import { Container } from './components/Container'
import { Header } from './components/Header'
import { ChatProvider } from './context/ChatContext'
import { CharacterProvider } from './context/CharacterContext'

function App() {
  return (
    <CharacterProvider>
      <ChatProvider>
        <Container>
          <Header />
          <Outlet />
        </Container>
      </ChatProvider>
    </CharacterProvider>
  )
}

export default App
