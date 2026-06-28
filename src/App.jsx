import { useState } from 'react'
import Bouton from './components/bouton.jsx'
import Button from './button.jsx'
import Banner from './components/Banner.jsx'
import Chatprestataire from './pages/Prestataires/Chatprestataire.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Chatprestataire />
    </div>
    
  )
}

export default App
