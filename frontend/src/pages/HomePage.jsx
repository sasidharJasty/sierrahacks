import React from 'react'
import Hero from '../../components/Hero'
import RevealSection from '../../components/RevealSection'
import AboutSection from '../../components/AboutSection'
import TracksSection from '../../components/TracksSection'

import Timeline from '../../components/Timeline'
import Criteria from '../../components/Criteria'
import Judges from '../../components/Judges'
import Members from '../../components/Members'
import FAQ from '../../components/FAQ'
import Sponsors from '../../components/Sponsors'

const HomePage = () => {
  return (
    <>
      <Hero />
      {/* <RevealSection /> */}
      <AboutSection />
      <TracksSection />
      <Sponsors />
      <Timeline />
      <FAQ />
      <Criteria />
      <Judges />
      <Members />
    </>
  )
}

export default HomePage