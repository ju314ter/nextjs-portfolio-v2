import Logo from '../components/logo'
import Section from '../components/section'

import { useState, useRef, useEffect } from 'react'

import Angular from '../public/angular.svg';
import Git from '../public/git.svg';
import Gitlab from '../public/gitlab.svg';
import Jira from '../public/jira.svg';
import Mongo from '../public/mongodb.svg';
import Node from '../public/nodejs.svg';
import ReactLogo from '../public/react.svg';
import Typescript from '../public/typescript.svg';

import data from '../data/realisations.json';
import GridProject from '../components/gridProjects';
import FleeingBorderAnimation from '../components/fleeingBorderAnimation';

import FollowMousePanel from '../components/followMousePanel'
import { useRouter } from 'next/router'

export default function Landing() {
  
  const router = useRouter();

  const [projectsSectionHeight, setProjectsSectionHeight] = useState(0)
  const [scrollPos, setScrollPos] = useState(0)
  const containerRef = useRef(null)

  useEffect(()=>{
    window.addEventListener('scroll', (e: any)=>{setScrollPos(window.scrollY)})

    const observedSection = document.querySelector('.SectionContact')

    const options = {}

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry)=>{
          // console.log(entry)
        })
      }, options)

    observer.observe(observedSection)

    return  window.removeEventListener('scroll', ()=>{console.log('scroll listener removed')})
  }, [])

  return (
    <div ref={containerRef}>
      <Section name='Landing'>
        <div className='LandingCardWrapper' style={{transform: `translate3d(0,${Math.round(scrollPos /4)}px,0)`}}>
          <h1 className='LandingCardWrapper-topCard-title'>Julien Féger</h1>
          <h2 className='LandingCardWrapper-topCard-subtitle'>Design & code</h2>
        </div>
        <div className='LogoWrapper' style={{transform: `translate3d(0,${scrollPos /-3}px,0)`}}>
          <Logo className='logo'/>
        </div>
        <div className='MaskedBorder'>
          <div className='MaskedBorder-frame'></div>
        </div>
      </Section>
      <Section name='Tech'>
        <div style={{position: 'relative', top: `0px`}}>
          <div className='Tech-text-wrapper'>
            <em className='Tech-text'>Creativity<span className="special-colorizing">X</span>Technique</em>
          </div>
          <div className='Tech-wheel-wrapper'>
            <div className="Tech-wheel">
              <div className="angular-logo-wrapper">
                  <Angular height={250} />
              </div>
              <div className="jira-logo-wrapper">
                  <Jira height={250} />
              </div>
              <div className="git-logo-wrapper">
                  <Git />
              </div>
              <div className="gitlab-logo-wrapper">
                  <Gitlab />
              </div>
              <div className="node-logo-wrapper">
                  <Node />
              </div>
              <div className="mongo-logo-wrapper">
                  <Mongo height={250} />
              </div>
              <div className="react-logo-wrapper">
                  <ReactLogo />
              </div>
              <div className="typescript-logo-wrapper">
                  <Typescript />
              </div>
            </div>
          </div>
        </div>
        <div className='MaskedBorder'>
          <div className='MaskedBorder-frame opposite-color'></div>
        </div>
      </Section>
      <Section name='Projects' style={ isFinite(projectsSectionHeight) ? {height: projectsSectionHeight + 150} : null}>
          <GridProject getHeight={(heights:[])=>setProjectsSectionHeight(Math.max(...heights))} />
      </Section>
      <Section name='Contact' style={{position: 'relative'}}>
        <div className="ContactMain">
          <FollowMousePanel>
            <p>Hello, I'm a french JS developper with a strong incentive to design, code and create stuff. Not only am I passionate about new tech, but also favor all kinds of arts and am well versed with socials problematics.</p>
          </FollowMousePanel>
          <div className="ContactMain-ContactLink ">
              <FleeingBorderAnimation><div style={{fontFamily: 'Rokkitt', fontSize: '1.5em', cursor: 'pointer'}} onClick={()=>{router.push ('https://linkedin.com')}}>LinkedIn</div></FleeingBorderAnimation>
              <FleeingBorderAnimation><div style={{fontFamily: 'Rokkitt', fontSize: '1.5em', cursor: 'pointer'}} onClick={()=>{router.push ('https://github.com')}}>GitHub</div></FleeingBorderAnimation>
              <FleeingBorderAnimation><div style={{fontFamily: 'Rokkitt', fontSize: '1.5em', cursor: 'pointer'}} onClick={()=>{router.push ('https://stackoverflow.com')}}>StackOverflow</div></FleeingBorderAnimation>
          </div>
        </div>
        <div className='MaskedBorder'>
          <div className='MaskedBorder-frame opposite-color'></div>
        </div>
      </Section>
    </div>
  )
}
