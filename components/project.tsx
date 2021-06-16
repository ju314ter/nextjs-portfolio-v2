import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/router'
import { animated as a, useSprings } from "react-spring";
import { useDrag } from 'react-use-gesture'
import clamp from 'lodash'

import Github from '../public/socialicons/github.svg';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DarkeningOverlay from '../components/darkeningOverlay';
import CloseIcon from '@material-ui/icons/Close';

import useMeasure from 'react-use-measure';
import styled, {keyframes} from 'styled-components';

const moveIn = (displayBullets) => keyframes`
  100% {
    top: 7vh;
    left: 5vw;
    width: 90vw;
    height: ${displayBullets? `70vh`:`90vh`};
  }
`

const moveOut = (top, left, height) => keyframes`
  0% {
    top: 5vh;
    left: 5vw;
    width: 90vw;
    height: 90vh;
  }
  100% {
    top: ${top}px;
    left: ${left}px;
    width: 300px;
    height: ${height}px;
  }
`

const rotateAndScaleInOut = () => keyframes`
  0% {
    transform: rotateZ(0deg) scale(1);
  }
  50% {
    transform: rotateZ(180deg) scale(0.7);
  }
  100% {
    transform: rotateZ(180deg) scale(1);
  }
`

const ProjectDetail = styled.div`
top: ${props => props.projectPos.top}px;
left: ${props => props.projectPos.left}px;
width: 300px;
height: ${props => props.projectHeight}px;
display: flex;
opacity: ${props => props.shouldRender ? `1`: `0`};
flex-direction: column;
background: transparent no-repeat center;
backgroundSize: contain;
position: fixed;
margin-top: 0;
border-radius: 8px;
transition: all 1 ease-in-out;
will-change: width height top left opacity;
z-index: 500;
border-left-width: 4px;
border-bottom-width: 4px;
border-right-width: 1px;
border-top-width: 1px;
animation: 0.3s ${props => props.isClicked ? moveIn(props.pagesArray.length > 1) : moveOut(props.projectPos.top,props.projectPos.left,props.projectHeight)} ${props => props.isClicked ? `ease-in` : `ease-out`} forwards;
`

const ContentWrapper = styled(a.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    will-change: transform;

    & div {
        touch-action: none;
        cursor: move;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
        width: 100%;
        height: 100%;
        will-change: transform;
    }
`

const BulletWrapper = styled(a.div)`
    position: absolute;
    bottom: -100px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CloseWrapper = styled(a.div)`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
    position: fixed;
    top: 0;
    right: 0;
    width: 5vw;
    height: 5vw;
    color: whitesmoke;
    cursor: pointer;
    
    &:hover {
        animation: 0.3s ${rotateAndScaleInOut} ease-in-out alternate;
    }
`

const getPages = nbPage => {
    let promiseArray = []
    for (let i = 0; i < nbPage; i++) {
      promiseArray.push(fetch('https://picsum.photos/1200', { method: 'GET' }))
    }
    return promiseArray
  }

const Project = ({onClick, color, project, projectHeight}:{color?: string, onClick: (cliked)=>void, project: any, projectHeight: number}) => {
    
    if (!project) { return null}

    const router = useRouter()
    
    const [isClicked, setClicked] = useState(false)
    const [shouldRender, setRender] = useState(isClicked);
    const [colorRef, setColorRef] = useState('white')

    const [projectRef, projectPos] = useMeasure()
    const [projectDetailRef, { width }] = useMeasure()

    const [index, setIndex] = useState(0)
    // let index = useRef(0)
    const [pagesArray, setPagesArray] = useState([])
    const [springProps, springsApi] = useSprings(
      pagesArray.length,
      i => ({
        x: i * width,
        scale: width === 0 ? 0 : 1,
        display: 'block',
      }),
      [width]
    )

    const [props, api] = useSprings(
        pagesArray.length,
        i => ({
          x: i * width,
          scale: width === 0 ? 0 : 1,
          display: 'block',
        }),
        [width]
      )

      useEffect(() => {
        setPagesArray(project.illustrationPath)
        // let responseArray = []
        // Promise.all(getPages(5))
        //   .then(values => values.map(value => responseArray.push(value.url)))
        //   .then(() => setPagesArray(responseArray))
      }, [])
    
      const bind = useDrag(({ active, movement: [mx], direction: [xDir], distance, cancel }) => {

        if(active &&  distance > width / 3.5 && xDir > 0 && index === 0) {
            console.log('no moar frame on the right')
            cancel()
        }
        if(active &&  distance > width / 3.5 && xDir < 0 && index === pagesArray.length - 1) {
            console.log('no moar frame on the left')
            cancel()
        }

        if (active && distance > width / 3) {
            setIndex(+clamp(index + (xDir > 0 ? -1 : 1), 0, pagesArray.length - 1))
            cancel()
        }

        api.start(i => {
          const x = (i - index) * width + (active ? mx : 0)
          const scale = active ? 1 - distance / width / 2 : 1
          return { x, scale, display: i < index - 1 || i > index + 1 ? 'none' : 'block' }
        })
      })
    
      const handleClick = reqIndex => {
        setIndex(reqIndex)
        api.start(i => {
          const x = (i - reqIndex) * width
          const scale = 1
          return { x, scale, display: i < index - 1 || i > index + 1 ? 'none' : 'block' }
        })
      }

    useEffect(() => {
        if (isClicked) setRender(true);
    }, [isClicked]);

    const onAnimationEnd = () => {
        if (!isClicked) setRender(false);
    }

    useEffect(()=>{
        setColorRef(color)
        document.addEventListener('keydown',(e)=>{
            if(e.key === 'Escape') setClicked(false)
        })

        return document.removeEventListener('keydown', ()=>{})
    }, [])

    return (
        <>
            <div className='Project' ref={projectRef} style={{background:`url(${project.illustrationPath[0]}) no-repeat center, whitesmoke`, backgroundSize: !!project.portrait  ? 'contain':'cover', height: projectHeight}}
                onClick={()=>setClicked(true)}>
                {!!project.repoPath && !! project.directUrl && (<>
                    <div className='Project-left-action' onClick={(e)=>{router.push(project.repoPath) && e.stopPropagation()}}><Github style={{fill : colorRef, width: '60%', height: '100%'}} /></div>
                    <div className='Project-right-action' onClick={(e)=>{router.push(project.directUrl) && e.stopPropagation()}} ><DynamicFeedIcon style={{fill : colorRef, width: '60%', height: '100%'}} /></div></>
                )}
                {!!project.repoPath && !project.directUrl &&  <div className='Project-left-action unique' onClick={()=>{router.push(project.repoPath)}}><Github style={{fill : colorRef, width: '60%', height: '100%'}} /></div>}
                {!!project.directUrl && !project.repoPath && <div className='Project-right-action unique' onClick={()=>{router.push(project.directUrl)}} ><DynamicFeedIcon style={{fill : colorRef, width: '60%', height: '100%'}} /></div>}
            </div>
            {shouldRender && 
            <>
                <ProjectDetail {...{projectPos, projectHeight, project, isClicked, shouldRender, pagesArray}}  ref={projectDetailRef} onAnimationEnd={onAnimationEnd}>
                    {pagesArray.length > 1 ? props.map(({ x, display, scale }, i) => (
                        <ContentWrapper {...bind()} key={i} style={{ display, x }}>
                            <a.div style={{ scale, backgroundImage: `url(${pagesArray[i]})` }} />
                        </ContentWrapper>
                    )): (
                        <ContentWrapper>
                            <a.div onClick={()=>setClicked(false)} style={{cursor: 'pointer', backgroundImage: `url(${pagesArray[0]})` }} />
                        </ContentWrapper>
                    )}
                    <BulletWrapper>
                        {pagesArray.length > 1 && pagesArray.map((el, i)=>(
                            <span key={'navbulletsproject' +i} onClick={(e) => { e.stopPropagation(); handleClick(i)}} className={index === i ? 'ProjectDetail-nav-bullet selected': 'ProjectDetail-nav-bullet'}/>
                        ))}
                    </BulletWrapper>
                </ProjectDetail>
                <DarkeningOverlay zIndex={100} name={'projectOverlay'} show={isClicked}/>
                <CloseWrapper onClick={()=>setClicked(false)}>
                    <CloseIcon style={{width: '80%', height: '80%'}}/>
                </CloseWrapper>
            </>
            }
        </>
    );
};

export default Project;