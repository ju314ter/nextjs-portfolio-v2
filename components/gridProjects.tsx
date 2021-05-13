import React, { useEffect, useState, useMemo } from "react";
import useMeasure from 'react-use-measure';
import { animated as a, useTransition } from "react-spring";
import data from '../data/realisations.json';

import shuffle from 'lodash.shuffle'

import Project from './project'
import GridTag from './tag'

const GridProject = () => {

    const minColWidth = 420
    const [refContainer, containerBounds] = useMeasure()
    const [refGrid, boundsGrid] = useMeasure()
    const [projectHeight, setProjectHeight] = useState(330)
    const [columns, setColumns] = useState(2)
    const formattedData: Array<any> = data.realisations
    const [items, set] = useState(formattedData)
    let tagsArray = ["Randomize"];
    data.realisations.forEach((real)=>{
        real.tags && real.tags.forEach((tag)=>{
            tagsArray.push(tag)
        })
    })
    tagsArray = tagsArray.filter((tag,i) => tagsArray.indexOf(tag) === i)
    const [selectedTags, setSelectedTags] = useState(['']);

    const [heights, gridItems] = useMemo(() => {
        let heights = new Array(columns).fill(0) // Each column gets a height starting with zero
        let gridItems = items.map((child, i) => {
            const column = heights.indexOf(Math.min(...heights)) // Basic masonry-grid placing, puts tile into the smallest column using Math.min
            const left = (boundsGrid.width / columns) * column // x = container width / number of columns * column index,
            const top = (heights[column] += projectHeight + 25) - projectHeight + 25 // y = it's just the height of the current column
            return { ...child, left, top, width: boundsGrid.width / columns, height: projectHeight + 25 }
        })
        return [heights, gridItems]
    }, [columns, items, boundsGrid.width, projectHeight])

    // // const transitions = useTransition(
    // //     gridItems,
    // //     (item: { projectName: string; height: number; width: number; left: number; top: number; }) => item.projectName,
    // //     {
    // //         from: ({ left = 0, top, width, height = 0 }) => ({ left, top, width, height, opacity: 0 }),
    // //         enter: ({ left = 0, top, width, height = 0 }) => ({ left, top, width, height, opacity: 1 }),
    // //         update: ({ left = 0, top, width, height = 0 }) => ({ left, top, width, height }),
    // //         leave: { height: 0, opacity: 0 },
    // //         config: { mass: 5, tension: 500, friction: 100 },
    // //         trail: 25
    // //     }
    // // )

    useEffect(() => {
        // setProjectHeight(330)
        setColumns(Math.floor(containerBounds.width / minColWidth))
        console.log(containerBounds)
    }, [containerBounds, projectHeight])

    const toggle = (tag: string) => {
        switch(tag) {
            case 'Randomize':
                set(shuffle(formattedData))
                setSelectedTags([''])
                break;
            default :
                if(selectedTags.includes(tag)) {
                    selectedTags.splice(selectedTags.indexOf(tag),1)
                    if(selectedTags.length === 1) {
                        set(formattedData)
                    } else {
                        set((prevState)=>([...prevState.filter((real)=>!real.tags.includes(tag) || selectedTags.some(selectedTag => real.tags.includes(selectedTag)))]))
                    }
                    setSelectedTags([...selectedTags])

                } else {
                    selectedTags.length === 1 ?
                        set(data.realisations.filter(real=>real.tags.includes(tag)))
                        :
                        set((prevState)=>(formattedData
                                            .filter(real=>real.tags.includes(tag) && !selectedTags.some(selectedTag => real.tags.includes(selectedTag)))
                                            .concat(prevState)))
                    setSelectedTags((prevState)=>([...prevState, tag]))
                    
                }
                break;
        }
    }

    // const handleProject = (project) => {
    //     properties.selectedProject(project)
    // }

    if (!isFinite(Math.max(...heights))) { 
        return (
            <div className='ProjectGridWrapper' ref={refContainer}>
                {
                    containerBounds.width < minColWidth ?
                    items.map((item, index)=>{
                        return (
                            <div key={'project-mobile-' + index}>
                                <div className='Project'>
                                    <div className='Project-left-action'></div>
                                    <div className='Project-right-action'></div>
                                </div>
                            </div>
                        )
                    }) : null
                }
            </div>
        ) 
    }
    else {
        return (
            <div className='ProjectGridWrapper' ref={refContainer}>
                <div className='Filter'>
                    <div className='Filter-title-wrapper'>
                        <span className='Filter-title-content'>Filter by tags</span>
                    </div>
                    <div className='Filter-tags'>
                        {tagsArray && tagsArray.map((tag, i)=>{
                            return <GridTag index={i} selected={selectedTags.includes(tag)} tag={tag} onTagClick={()=>(toggle(tag))} />
                        })}
                    </div>
                </div>
                <div className='Projects'>
                    <div className='ProjectsWrapper' ref={refGrid}>
                        <div className='Project'>
                            <div className='Project-left-action'></div>
                            <div className='Project-right-action'></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};

export default GridProject;

                {/* 
                <div style={{ width: '100%', height: Math.max(...heights) + 100}}>
                    <div ref={ref} className="grid">
                        { 
                            // transitions.map(({ item, key, props },i) => {
                            // return (
                            //     <a.div
                            //         key={key + '-' + i}
                            //         className="animated-item-wrapper"
                            //         style={{ ...props }}
                            //     >
                            //         <Project onClick={handleProject} project={item} />
                            //     </a.div>
                            // )})
                        }
                    </div>
                </div> */}
