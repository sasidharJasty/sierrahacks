import { useState } from 'react'

import CustomCursor from '../components/CustomCursor'
import Navbar from '../components/Navbar'
import './App.css'
import Hero from '../components/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-full h-full'>
      <CustomCursor />
      <Navbar />
      <Hero />
    </div>
  )
}

export default App
