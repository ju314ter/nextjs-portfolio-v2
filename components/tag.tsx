import React, { useEffect, useState, useRef } from "react";
import { animated as a, useSpring } from "react-spring";
import Button from '@material-ui/core/Button';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import useMeasure from 'react-use-measure';


const GridTag = ({isSelected, tag, onTagClick, color}:{isSelected?: boolean, color?: string, tag: string, onTagClick?: ()=>void, key: string}) => {
    const [textRef, textBounds] = useMeasure()
    const [isHovered, setHovered] = useState(false)
    const colorRef = useRef(color)

    const textStyleRemove = useSpring({maxWidth: isSelected ? 500 : 0, opacity: isSelected ? 1 : 0})
    const textStyleAdd = useSpring({maxWidth: isHovered ? 500 : 0, opacity: isHovered ? 1 : 0})

    const bgStyle = useSpring({ width: isSelected || isHovered ? textBounds.width + 10 : 0, background: colorRef.current })

    useEffect(()=>{
        colorRef.current = color
    }, [])
    
    return (
        <div className='Filter-tag-wrapper' onClick={onTagClick}
        onMouseEnter={()=>{setHovered(true)}}
        onMouseLeave={()=>{setHovered(false)}} >
            <span className='Filter-tag-content' style={tag=='Randomize' ? {fontWeight:'bold'}: null} ref={textRef}>{tag}</span>
            {tag!=='Randomize' && isHovered && !isSelected ? (<a.span style={textStyleAdd} className='Filter-tag-button-remove'><AddCircleIcon/></a.span>) : null}
            {tag!=='Randomize' && isSelected ? (<a.span style={textStyleRemove} className='Filter-tag-button-remove'><RemoveCircleIcon/></a.span>) : null}
            <a.span className='Filter-tag-background' style={bgStyle}></a.span>
        </div>
    );
};

export default GridTag;