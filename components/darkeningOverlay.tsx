import React, {useState,useEffect,useRef} from 'react';
import {useSpring, animated as a} from 'react-spring';
import styled, { keyframes } from 'styled-components';
import zIndex from '@material-ui/core/styles/zIndex';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const Overlay = styled(a.div)`
position: fixed;
width: 100vw;
top: 0;
height: 100vh;
background: black;
animation: 0.3s ${props => props.show ? fadeIn : fadeOut} ease-out forwards;
z-index: ${props => props.zIndex}
`

const DarkeningOverlay = ({zIndex, name, show = false}:{zIndex: number, name: string, show?: boolean}):React.ReactNode => {
    const [shouldRender, setRender] = useState(show);

    useEffect(() => {
        if (show) setRender(true);
    }, [show]);

    const onAnimationEnd = () => {
        if (!show) setRender(false);
    }

    return (
        shouldRender && <Overlay {...{zIndex, show}} onAnimationEnd={onAnimationEnd} className={'Overlay_darkening '} />
    )
}

export default DarkeningOverlay