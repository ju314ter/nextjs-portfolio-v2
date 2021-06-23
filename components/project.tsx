import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/router'
import { animated as a, useSprings } from "react-spring";
import { useDrag } from 'react-use-gesture'
import clamp from 'lodash'

import Github from '../public/socialicons/github.svg';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DarkeningOverlay from '../components/darkeningOverlay';
import CloseIcon from '@material-ui/icons/Close';
import GridTag from '../components/tag'

import useMeasure from 'react-use-measure';
import styled, {keyframes} from 'styled-components';

const moveIn = (displayBullets,top, left, height) => keyframes`
  0% {
    top: ${top}px;
    left: ${left}px;
    width: 300px;
    height: ${height}px;
  }
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
animation: 0.3s ${props => props.isClicked ? moveIn(props.pagesArray.length > 1,props.projectPos.top,props.projectPos.left,props.projectHeight) : moveOut(props.projectPos.top,props.projectPos.left,props.projectHeight)} ${props => props.isClicked ? `ease-in` : `ease-out`} forwards;
`

const TagsWrapper = styled(a.div)`
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90vw;
    height: 5vh;
    background: transparent;
    margin-right: 5vw;
    margin-left: 5vw;
    border-radius: 8px;
    
    & div {
      padding-top: 10px;
      font-size: 2vw;
      color: whitesmoke;
      margin: 1em;
      font-family: 'Jost', 'sans-serif';
    }
`

const ContentWrapper = styled(a.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    will-change: transform;

    & div {
        touch-action: none;
        cursor: move;
        background-repeat: no-repeat;
        background-position: center center;
        width: 100%;
        height: 100%;
        will-change: transform;
    }
`

const BulletWrapper = styled(a.div)`
    position: fixed;
    bottom: 150px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`

const CloseWrapper = styled(a.div)`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
    left: 0;
    width: 100vw;
    height: 5vw;
    color: whitesmoke;
    cursor: pointer;
    
    & svg:hover {
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

    const [propsSprings, apiSprings] = useSprings(
      pagesArray.length,
      i => ({
        x: i * width,
        scale: 1,
        opacity: 1,
      }),
      [width]
    )

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

      apiSprings.start(i => {
        const x = (i - index) * width + (active ? mx : 0)
        const scale = active ? 1 - distance / width / 2 : 1
        i === 3 ? console.log(i < index - 1 || i > index + 1):null
        return { x, scale, opacity: i < index - 1 || i > index + 1 ? 0 : 1 }
      })
    })
    
    const setRequiredIndex = reqIndex => {
      setIndex(reqIndex)
      apiSprings.start(i => {
        const x = (i - reqIndex) * width
        const scale = 1
        return { x, scale, opacity: i === 0 ? 1 : 0}
      })
    }

    const handleClose = () => {
      setRequiredIndex(0)
      setTimeout(()=>setClicked(false),500)
    }

    const onAnimationEnd = () => {
        if (!isClicked) setRender(false);
    }

    useEffect(() => {
      setPagesArray(project.illustrationPath)
      // let responseArray = []
      // Promise.all(getPages(5))
      //   .then(values => values.map(value => responseArray.push(value.url)))
      //   .then(() => setPagesArray(responseArray))
    }, [])

    useEffect(() => {
        if (isClicked) setRender(true);
        if (!isClicked) {setRequiredIndex(0);setTimeout(()=>setClicked(false),500)}
    }, [isClicked]);

    useEffect(()=>{
        setColorRef(color)
        document.addEventListener('keydown',(e)=>{
            if(e.key === 'Escape') { handleClose() }
        })

        return document.removeEventListener('keydown', ()=>{})
    }, [])

    return (
        <>
            <div className='Project' ref={projectRef} style={{background:`url(${project.illustrationPath[0]}) no-repeat center, whitesmoke`, backgroundSize: !!project.portrait  ? 'contain':'cover', height: projectHeight}}
                onClick={()=>setClicked(true)}>
                {!!project.repoPath && !! project.directUrl && (<>
                    <div className='Project-left-action' onClick={(e)=>{router.push(project.repoPath) && e.stopPropagation()}}><Github style={{fill : colorRef, width: '60%', height: '100%'}} /></div>
                    <div className='Project-right-action' onClick={(e)=>{router.push(project.directUrl)  && e.stopPropagation()}} ><DynamicFeedIcon style={{fill : colorRef, width: '60%', height: '100%'}} /></div></>
                )}
                {!!project.repoPath && !project.directUrl &&  <div className='Project-left-action unique' onClick={(e)=>{router.push(project.repoPath)  && e.stopPropagation()}}><Github style={{fill : colorRef, width: '60%', height: '100%'}} /></div>}
                {!!project.directUrl && !project.repoPath && <div className='Project-right-action unique' onClick={(e)=>{router.push(project.directUrl)  && e.stopPropagation()}} ><DynamicFeedIcon style={{fill : colorRef, width: '60%', height: '100%'}} /></div>}
            </div>
            {shouldRender && 
            <>
                <ProjectDetail {...{projectPos, projectHeight, project, isClicked, shouldRender, pagesArray}}  ref={projectDetailRef} onAnimationEnd={onAnimationEnd}>
                    {pagesArray.length > 1 ? propsSprings.map(({ x, opacity, scale }, i) => (
                        <ContentWrapper {...bind()} key={i} style={{ opacity, x, zIndex: 400 - i}}>
                            <a.div style={{ scale, backgroundImage: `url(${pagesArray[i]})`,backgroundSize: `contain`}} />
                        </ContentWrapper>
                    )): (
                        <ContentWrapper>
                            <a.div onClick={()=>setClicked(false)} style={{cursor: 'pointer', backgroundSize: `contain`, backgroundImage: `url(${pagesArray[0]})`}} />
                        </ContentWrapper>
                    )}
                </ProjectDetail>
                <DarkeningOverlay zIndex={100} name={'projectOverlay'} show={isClicked}/>
                <BulletWrapper>
                        {pagesArray.length > 1 && pagesArray.map((el, i)=>(
                            <span key={'navbulletsproject' +i} onClick={(e) => { e.stopPropagation(); setRequiredIndex(i)}} className={index === i ? 'ProjectDetail-nav-bullet selected': 'ProjectDetail-nav-bullet'}/>
                        ))}
                </BulletWrapper>
                <TagsWrapper>
                  {project.tags && project.tags.map((tag,i)=>
                    <div key={tag + i} className='Filter-tag-wrapper' style={{cursor: 'default'}}>{tag}</div>)
                  }
                </TagsWrapper>
                <CloseWrapper onClick={()=>handleClose()} style={{bottom: pagesArray.length > 1 ? '50px': 0}}>
                    <CloseIcon style={{width: '5vw', height: '100%'}}/>
                </CloseWrapper>
            </>
            }
        </>
    );
};

export default Project;