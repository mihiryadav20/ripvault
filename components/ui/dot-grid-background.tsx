"use client"

import { useEffect, useRef } from "react"
import styles from "./DotGrid.module.css"

export function DotGridBackground() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return
      
      const { clientX, clientY } = e
      const { left, top, width, height } = gridRef.current.getBoundingClientRect()
      
      const x = clientX - left
      const y = clientY - top
      
      gridRef.current.style.setProperty('--mouse-x', `${x}px`)
      gridRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      ref={gridRef}
      className={`${styles.grid} absolute inset-0 -z-10 h-full w-full`}
      aria-hidden="true"
    />
  )
}
