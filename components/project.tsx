import React, { useEffect, useState, useRef } from "react";
import { animated as a, useSpring } from "react-spring";
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

import useMeasure from 'react-use-measure';


const Project = ({onClick, color, project}:{color?: string, onClick: ()=>void, project: any}) => {

    if (!project) { return null}

    const [isHovered, setHovered] = useState(false)
    const overlayOpacitySpring = useSpring({opacity : isHovered ? 0 : 0.3})

    useEffect(()=>{
        // console.log(project)
    }, [project])

    return (
    <div className='Project' style={{background:`url(${project.illustrationPath[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        onClick={onClick}
        onMouseEnter={()=>{setHovered(true)}}
        onMouseLeave={()=>{setHovered(false)}}>
        <a.div className="" style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, opacity: overlayOpacitySpring.opacity, background: color}}></a.div>
        <div className='Project-left-action'></div>
        <div className='Project-right-action'></div>
    </div>
    );
};

export default Project;