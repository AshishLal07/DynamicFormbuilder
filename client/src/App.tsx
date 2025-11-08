import './App.css'
import { AuthProvider } from './contexts/auth-context'
import CustomRoutes from './routes'

function App() {

  return (
    <>
      <AuthProvider>
        <CustomRoutes />
      </AuthProvider>
    </>
  )
}

export default App
