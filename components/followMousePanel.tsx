import React, {useState, useEffect, useRef} from 'react'
import styled, { keyframes } from 'styled-components';
import {useSpring, animated as a} from 'react-spring'
import { useGesture } from 'react-use-gesture'


const FollowMousePanel = (props:any):React.ReactNode => {

    const domTarget = useRef(null)
    const widthOfPannel = useRef(0)
    const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 40
    const calcY = (x: number, lx: number) => {
        return (x - lx - 600 / 2) / 40
    }
  
    const [{rotateX, rotateY, rotateZ, x, y}, api] = useSpring(
      () => ({
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        x: 0,
        y: 0,
        config: { mass: 5, tension: 350, friction: 40 },
      })
    )
  
    useGesture(
      {
        onMove: ({ xy: [px, py], dragging }) =>
          {
            return !dragging &&
            api.start({
              rotateX: calcX(py, y.get()),
              rotateY: calcY(px, x.get()),
              })
        },
        onHover: ({ hovering }) =>
          {
            return !hovering && api.start({ rotateX: 0, rotateY: 0 })
          }
      },
      { domTarget, eventOptions: { passive: false } }
    )
  
    useEffect(() => {
      const preventDefault = (e: Event) => e.preventDefault()
      document.addEventListener('gesturestart', preventDefault)
      document.addEventListener('gesturechange', preventDefault)
  
      return () => {
        document.removeEventListener('gesturestart', preventDefault)
        document.removeEventListener('gesturechange', preventDefault)
      }
    }, [])

    return (
        <a.div className="ContactMain-Disclaimer" ref={domTarget} style={{
            transform: 'perspective(600px)',
            rotateX,
            rotateY,
            rotateZ,
          }}>
              {props.children}
        </a.div>
    )
}

export default FollowMousePanel