import React, { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from 'next/router'
import { animated as a, useTransition, useSpringRef } from "react-spring";
import Github from '../public/socialicons/github.svg';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import DarkeningOverlay from '../components/darkeningOverlay';
import CloseIcon from '@material-ui/icons/Close';

import useMeasure from 'react-use-measure';
import styled, {keyframes} from 'styled-components';

const moveIn = (displayBullets) => keyframes`
  100% {
    top: 5vh;
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
animation: 0.3s ${props => props.isClicked ? moveIn(props.illustrationsNodes.length > 1) : moveOut(props.projectPos.top,props.projectPos.left,props.projectHeight)} ${props => props.isClicked ? `ease-in` : `ease-out`} forwards;
`

const BulletWrapper = styled(a.div)`
    display: flex;
    flex: 0 0 30%;
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


const Project = ({onClick, color, project, projectHeight}:{color?: string, onClick: (cliked)=>void, project: any, projectHeight: number}) => {
    
    if (!project) { return null}

    const router = useRouter()
    
    const [isClicked, setClicked] = useState(false)
    const [shouldRender, setRender] = useState(isClicked);
    const [colorRef, setColorRef] = useState('white')

    const [isFirstImageLoop, setIsFirstImageLoop] = useState(true)
    const [index, set] = useState(0)

    const [projectRef, projectPos] = useMeasure()
    const projectRefDetail = useRef<HTMLHeadingElement>(null)

    const [illustrationsNodes, setIllustrationsNodes] = useState(() => {
        let pagesArray = [];
        if(project.illustrationPath) {
            for (var i = 0, len = project.illustrationPath.length; i < len; i++) {
                pagesArray.push(project.illustrationPath[i].toString())
            }
        }
        return pagesArray
    })

    const onImageClick = useCallback((e) => {
        e.stopPropagation();
        isFirstImageLoop === false ? (setClicked(false),set(0),setIsFirstImageLoop(true)):
        set(state => (state + 1) % illustrationsNodes.length)
    }, [isFirstImageLoop])

    // const transitions = useTransition(index, {
    //     keys: p => p, 
    //     from: { opacity: 0, transform: 'translate3d(50%,0,0)' },
    //     enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    //     leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },

    // })

    const transRef = useSpringRef()
    const transitions = useTransition(index, {
        ref: transRef,
        keys: null,
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
        config: { mass: 5, tension: 500, friction: 100 },
      })

    useEffect(()=>{
        transRef.start()
        illustrationsNodes.length - 1 === index ? setIsFirstImageLoop(false) : null
    },[index])

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
                <ProjectDetail {...{projectPos, projectHeight, project, isClicked, shouldRender, illustrationsNodes}} ref={projectRefDetail} onAnimationEnd={onAnimationEnd}>
                    <div style={{flex: '0 0 100%', position: 'relative', overflow: 'hidden'}} onClick={(e)=>(onImageClick(e))}>
                            {illustrationsNodes.length > 1 ?
                            transitions((values, item, transition, index) => {
                                return <a.div key={index} className="ProjectDetail-imgWrapper" style={{...values}}><img src={illustrationsNodes[item]}/></a.div>
                            }) 
                            : <a.div className="ProjectDetail-imgWrapper" onClick={()=>setClicked(false)}><img src={illustrationsNodes[0]} /></a.div>}
                    </div>
                    <BulletWrapper>
                        {illustrationsNodes.length > 1 && illustrationsNodes.map((el, i)=>(
                            <span key={'navbulletsproject' +i} onClick={(e) => { e.stopPropagation(); return set(i)}} className={index === i ? 'ProjectDetail-nav-bullet selected': 'ProjectDetail-nav-bullet'}/>
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