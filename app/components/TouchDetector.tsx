'use client';

import { useRef } from 'react';
import { TouchPoint } from '../types';
import styles from './TouchDetector.module.css';

interface TouchDetectorProps {
  onTouchPointsUpdate: (points: TouchPoint[]) => void;
  isSelecting: boolean;
  selectedPoint: TouchPoint | null;
  touchPoints: TouchPoint[];
}

export default function TouchDetector({ 
  onTouchPointsUpdate, 
  isSelecting, 
  selectedPoint,
  touchPoints 
}: TouchDetectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newPoint = {
      id: Date.now(), // Use timestamp as unique ID
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const updatedPoints = [...touchPoints, newPoint];
    onTouchPointsUpdate(updatedPoints);
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none cursor-pointer"
      onClick={handleClick}
    >
      {touchPoints.map((point) => (
        <div
          key={point.id}
          className={`absolute h-16 w-16 rounded-full border-4 transition-all select-none ${
            styles.touchPoint
          } ${
            selectedPoint?.id === point.id
              ? 'border-red-500 bg-red-200'
              : 'border-blue-500 bg-blue-200'
          } ${isSelecting ? styles['scale-120'] : ''}`}
          style={{
            left: `${point.x - 32}px`,
            top: `${point.y - 32}px`,
            transform: `translate(0, 0)`,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}