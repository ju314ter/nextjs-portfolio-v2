import React, {useState,useEffect,useRef} from 'react';

const Section = (props:any):React.ReactNode => {
    return (
        <div {...props} className={'Section'+ props.name}>
            {props.children}
        </div>
    )
}

export default Section