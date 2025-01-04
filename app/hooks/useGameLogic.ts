'use client';

import { useState, useCallback } from 'react';
import { TouchPoint, Category } from '../types';

export function useGameLogic(category: Category) {
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<TouchPoint | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleStart = useCallback(() => {
    if (touchPoints.length === 0) return;

    setIsSelecting(true);
    
    // Random player selection
    const randomIndex = Math.floor(Math.random() * touchPoints.length);
    const randomChallenge = category.challenges[
      Math.floor(Math.random() * category.challenges.length)
    ];

    // Dramatic selection effect
    setTimeout(() => {
      setSelectedPoint(touchPoints[randomIndex]);
      setCurrentChallenge(randomChallenge);
      setIsSelecting(false);
    }, 1000);
  }, [touchPoints, category.challenges]);

  const handleReset = useCallback(() => {
    setSelectedPoint(null);
    setCurrentChallenge(null);
    setIsSelecting(false);
    setTouchPoints([]); // Clear all points for the next round
  }, []);

  return {
    touchPoints,
    setTouchPoints,
    selectedPoint,
    currentChallenge,
    isSelecting,
    handleStart,
    handleReset,
  };
}