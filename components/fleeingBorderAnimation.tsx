import React, {useState, useEffect, useRef} from 'react'
import useMeasure from 'react-use-measure'
import styled, { keyframes } from 'styled-components';
import {useSpring, animated as a} from 'react-spring';
import { useThemeContext } from '../store/themeContext'

const AnimationWrapper = styled.div`
    position: relative;
    overflow: hidden;
    padding: 10px;
`
const BottomBorder = styled(a.div)`
    display: block;
    content: '';
    background: ${props=>props.contentColor};
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 2px;
    transform-origin: left;
`
  
const FleeingBorderAnimation = (props:any):React.ReactNode => {
    const [wrapperRef, wrapperBounds] = useMeasure()

    const {theme} = useThemeContext()
    const { contentColor } = theme;

    const _intervalRefScale = useRef(null);
    const [startCounter,setStartCounter] = useState(false);
    const [counter,setCounter] = useState(0);
    const [translation, translate] = useState(false)
    
    const bottomBorderAnimationStyle = useSpring({
        transform: `scaleX(${counter/4 + Math.pow(counter,1.3)})`,
        onRest: (e)=>{
            setTimeout(()=>{setCounter(0)}, 500)
        }})

    const translateAnimationStyle = useSpring({transform: translation ? 'translateX(150%)' : 'translateX(0%)', onResolve: ()=>{translate(false)}})
    
    useEffect(() => {
        if(startCounter) {
            let innerCounter = 0
            _intervalRefScale.current = setInterval(() => {
                 if(innerCounter < 100) requestAnimationFrame(()=>setCounter((counter) => counter+1)) && innerCounter++
          },16);
        } else {
            let innerCounter = 0
            clearInterval(_intervalRefScale.current);
        }
        return () => clearInterval(_intervalRefScale.current);
      },[startCounter]);

    return (
        <AnimationWrapper ref={wrapperRef} {...props} onMouseEnter={() => setStartCounter(true)} onMouseLeave={() => {setStartCounter(false); translate(true)}}>
            {props.children}
            <a.div style={translateAnimationStyle}>
                <BottomBorder style={bottomBorderAnimationStyle} {...{contentColor}}/>
            </a.div>
        </AnimationWrapper>
    )
}

export default FleeingBorderAnimation