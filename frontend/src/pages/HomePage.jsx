import React from 'react'
import Hero from '../../components/Hero'

import Timeline from '../../components/Timeline'
import Criteria from '../../components/Criteria'
import Judges from '../../components/Judges'
import Members from '../../components/Members'
import FAQ from '../../components/FAQ'


const HomePage = () => {
  return (
    <>
      <Hero />
      <Timeline />
      <FAQ />
      <Criteria />
      <Members />
    </>
  )
}

export default HomePage