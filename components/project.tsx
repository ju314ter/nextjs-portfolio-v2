import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/router'
import { animated as a, useSpring, useSpringRef } from "react-spring";
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Github from '../public/socialicons/github.svg';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

import useMeasure from 'react-use-measure';
import styled, { keyframes } from 'styled-components';

const ProjectDetail = styled.div`
top:${props => props.projectPos.top}px;
left: ${props => props.projectPos.left}px;
width: 360px;
height: ${props => props.projectHeight}px;
display: ${props => props.isClicked ? `block`: `none`};
background: red no-repeat center;
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

    &:hover {
    transition: all 1s ease-in-out;
    opacity: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border-radius:0;
    }
`


const Project = ({onClick, color, project, projectHeight}:{color?: string, onClick: ()=>void, project: any, projectHeight: number}) => {
    
    if (!project) { return null}

    const router = useRouter()
    
    const [isHovered, setHovered] = useState(false)
    const [isClicked, setClicked] = useState(false)
    const overlayOpacitySpring = useSpring({opacity : isHovered ? 0 : 0.3})

    const [projectRef, projectPos] = useMeasure()
    const projectRefDetail = useRef<HTMLHeadingElement>(null)

    // const [styleDetail, styleDetailApi] = useSpring(()=>({top:`${projectPos.top}px`, left: `${projectPos.left}px`, width: '360px', height: `${projectHeight}px`}))

    const handleClick= (e) => {
        setClicked(!isClicked)
        projectRefDetail.current.classList.toggle('active')
    }

    return (
        <>
            <div className='Project' ref={projectRef} style={{background:`url(${project.illustrationPath[0]}) no-repeat center`, backgroundSize: !!project.portrait  ? 'contain':'cover', height: projectHeight}}
                onClick={handleClick}
                onMouseEnter={()=>{setHovered(true)}}
                onMouseLeave={()=>{setHovered(false)}}>
                {!!project.repoPath && !! project.directUrl && (<>
                    <div className='Project-left-action' onClick={(e)=>{router.push(project.repoPath) && e.stopPropagation()}}><Github style={{width: '60%', height: '100%'}} /></div>
                    <div className='Project-right-action' onClick={(e)=>{router.push(project.directUrl) && e.stopPropagation()}} ><DynamicFeedIcon style={{width: '60%', height: '100%'}} /></div></>
                )}
                {!!project.repoPath && !project.directUrl &&  <div className='Project-left-action unique' onClick={()=>{router.push(project.repoPath)}}><Github style={{width: '60%', height: '100%'}} /></div>}
                {!!project.directUrl && !project.repoPath && <div className='Project-right-action unique' onClick={()=>{router.push(project.directUrl)}} ><DynamicFeedIcon style={{width: '60%', height: '100%'}} /></div>}
            </div>
            <ProjectDetail {...{projectPos, projectHeight, project, isClicked}} ref={projectRefDetail} onClick={handleClick}>
                <div style={{width: '100%', height: '100%', background: `url(${project.illustrationPath[0]}) no-repeat center`, backgroundSize: 'auto 100%'}}/>
            </ProjectDetail>
        </>
    );
};

export default Project;