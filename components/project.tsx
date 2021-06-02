import React, { useEffect, useState, useRef } from "react";
import { animated as a, useSpring, useSpringRef } from "react-spring";
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import Github from '../public/socialicons/github.svg';

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

    &:hover {
    transition: all 1s ease-in-out;
    opacity: 1;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    }
`


const Project = ({onClick, color, project, projectHeight}:{color?: string, onClick: ()=>void, project: any, projectHeight: number}) => {
    
    if (!project) { return null}
    
    const [isHovered, setHovered] = useState(false)
    const [isClicked, setClicked] = useState(false)
    const overlayOpacitySpring = useSpring({opacity : isHovered ? 0 : 0.3})

    const [projectRef, projectPos] = useMeasure()
    const projectRefDetail = useRef<HTMLHeadingElement>(null)

    // const [styleDetail, styleDetailApi] = useSpring(()=>({top:`${projectPos.top}px`, left: `${projectPos.left}px`, width: '360px', height: `${projectHeight}px`}))

    const handleClick= (e) => {
        setClicked(!isClicked)
        console.log(projectRefDetail.current)
        projectRefDetail.current.classList.toggle('active')
    }

    return (
        <>
            <div className='Project' ref={projectRef} style={{background:`url(${project.illustrationPath[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', height: projectHeight}}
                onClick={handleClick}
                onMouseEnter={()=>{setHovered(true)}}
                onMouseLeave={()=>{setHovered(false)}}>
                <a.div className="" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: overlayOpacitySpring.opacity, background: color}}></a.div>
                <div className='Project-left-action'><Github style={{width: '60%', height: '100%'}} /></div>
                <div className='Project-right-action'></div>
            </div>
            <ProjectDetail {...{projectPos, projectHeight, project, isClicked}} ref={projectRefDetail} onClick={handleClick}>
                <div style={{width: '100%', height: '100%', background: `url(${project.illustrationPath[0]}) no-repeat center`, backgroundSize: 'auto 100%', borderRadius: 8}}/>
            </ProjectDetail>
        </>
    );
};

export default Project;