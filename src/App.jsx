import { useState } from 'react'
import {Button} from './components/commons'
import ComponentShowcase from './pages/showcase/ComponentShowcase'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ComponentShowcase/>
    </div>
      
  )
}

export default App
