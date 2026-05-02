import AppRouter from "./app/router/AppRouter"
import { AuthProvider } from "./app/core/context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App