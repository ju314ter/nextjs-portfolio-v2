import React, { useEffect, useState, useRef } from "react";
import { animated as a, useSpring } from "react-spring";
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';


const GridTag = ({selected, tag, onTagClick, index}:{selected?: boolean, tag: string, onTagClick: ()=>void, index: number}) => {
    const style = useSpring({maxWidth: selected ? 500 : 0, opacity: selected ? 1 : 0})
    return (
        <div key={tag + '-' + index} className='Filter-tag-wrapper' onClick={onTagClick}>
            <span className='Filter-tag-content'>{tag}</span>
            {tag!=='Randomize' && (<a.span style={style} className='Filter-tag-button-remove'><CancelIcon/></a.span>)}
        </div>
    );
};

export default GridTag;