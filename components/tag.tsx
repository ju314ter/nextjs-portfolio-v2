import React, { useEffect, useState, useRef } from "react";
import { animated as a, useSpring } from "react-spring";
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

import useMeasure from 'react-use-measure';


const GridTag = ({selected, tag, onTagClick, index, color}:{selected?: boolean, color?: string, tag: string, onTagClick: ()=>void, index: number, key: string}) => {
    const [textRef, textBounds] = useMeasure()

    const textStyle = useSpring({maxWidth: selected ? 500 : 0, opacity: selected ? 1 : 0})

    const [bgStyle, setBgStyle] = useSpring(() => ({ width: 0, background: color }))
    
    return (
        <div className='Filter-tag-wrapper' onClick={onTagClick}
        onMouseEnter={()=>{setBgStyle.start({width: textBounds.width + 10})}}
        onMouseLeave={()=>{setBgStyle.start({width: 0})}} >
            <span className='Filter-tag-content' style={tag=='Randomize' ? {fontWeight:'bold'}: null} ref={textRef}>{tag}</span>
            {tag!=='Randomize' && (<a.span style={textStyle} className='Filter-tag-button-remove'><CancelIcon/></a.span>)}
            <a.span className='Filter-tag-background' style={bgStyle}></a.span>
        </div>
    );
};

export default GridTag;