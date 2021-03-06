import React, { useEffect, useState, useMemo } from "react";
import useMeasure from 'react-use-measure';
import { animated as a, useTransition } from "react-spring";
import data from '../data/realisations.json';

import shuffle from 'lodash.shuffle'

import Project from './project'
import GridTag from './tag'

const colorArray = ['rgb(206,143,143)','rgb(143,195,206)','rgb(143, 206, 176)','rgb(157, 143, 206)','rgb(143, 206, 200)','rgb(206, 164, 143)','rgb(204, 206, 143)','rgb(206, 143, 181)']

interface IProject {
    projectName: string,
    projectSlug: string,
    portrait?: boolean,
    repoPath: string,
    directUrl?: string,
    illustrationPath: string[],
    tags: string[],
    description: string
}

const isReal = (number: number) => {
    return isFinite(number) && !isNaN(number)
}

const GridProject = (props) => {

    const minColWidth = 320
    const [refGrid, boundsGrid] = useMeasure()
    const [projectHeight, setProjectHeight] = useState(280)
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
        props.getHeight(heights)
        return [heights, gridItems]
    }, [columns, items, boundsGrid.width, projectHeight])

    const transitions = useTransition(gridItems, {
        keys: (item: { projectName: string; height: number; width: number; left: number; top: number; }) => item.projectName,
        from: ({ left, top, width, height }) => ({ left, top, width, height, opacity: 0 }),
        enter: ({ left, top, width, height}) => ({ left, top, width, height, opacity: 1 }),
        update: ({ left, top, width, height}) => ({ left, top, width, height }),
        leave: { height: 0, opacity: 0 },
        config: { mass: 5, tension: 500, friction: 100 },
        trail: 25
      })

    useEffect(()=>{
        set(shuffle(formattedData))
    },[])

    useEffect(() => {
        boundsGrid.width !== 0 ? setColumns(Math.floor(boundsGrid.width / minColWidth)):null
    }, [boundsGrid, projectHeight])

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
                        set(formattedData.filter(real=>real.tags.includes(tag)))
                        :
                        set((prevState)=>(formattedData
                                            .filter(real=>real.tags.includes(tag) && !selectedTags.some(selectedTag => real.tags.includes(selectedTag)))
                                            .concat(prevState)))
                    setSelectedTags((prevState)=>([...prevState, tag]))
                    
                }
                break;
        }
    }

    const handleProjectClick = (clicked) => {
        // props.selectedProject(project)
        props.onProjectToggle(clicked)
    }

    return (
        <div className='ProjectGridWrapper'>
            <div className='Filter-wrapper'>
                <div className='Filter'>
                    <div className='Filter-title-wrapper'>
                        <span className='Filter-title-content'>Filter by tags</span>
                    </div>
                    <div className='Filter-tags'>
                        {tagsArray && tagsArray.map((tag, i)=>{
                            return <GridTag key={tag + '-' + i} color={colorArray[Math.floor(Math.random() * colorArray.length)]} isSelected={selectedTags.includes(tag)} tag={tag} onTagClick={()=>(toggle(tag))} />
                        })}
                    </div>
                </div>
            </div>
            <div className='ProjectsWrapper' ref={refGrid}>
                {
                    !isFinite(Math.max(...heights)) ? null : ( transitions((props: any, item: any) => {
                        return (
                            <a.div
                            key={item}
                            className="animated-item-wrapper"
                            style={{
                                ...props
                            }}>
                                <Project project={item} projectHeight={projectHeight} color={colorArray[Math.floor(Math.random() * colorArray.length)]} onClick={(click)=>handleProjectClick(click)}/>
                            </a.div>
                        )
                    }))
                }
            </div>
        </div>
    );
};

export default GridProject;