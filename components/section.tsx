import React, {useState,useEffect,useRef} from 'react';
import useMeasure from 'use-measure';

const Section = (props:any):React.ReactNode => {
    return (
        <div {...props} className={'Section'+ props.name}>
            {props.children}
        </div>
    )
}

export default Section