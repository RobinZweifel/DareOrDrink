'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  id: number;
  x: number;
  y: number;
  color: string;
  number: number;
  isHighlighted?: boolean;
  backgroundColor?: string;
}

// Array of vibrant colors
const colors = [
  'rgb(239, 68, 68)',   // red
  'rgb(34, 197, 94)',   // green
  'rgb(59, 130, 246)',  // blue
  'rgb(168, 85, 247)',  // purple
  'rgb(249, 115, 22)',  // orange
  'rgb(236, 72, 153)',  // pink
  'rgb(234, 179, 8)',   // yellow
];

const backgroundPattern = {
  backgroundColor: '#eff6fb',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23cecece' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
};

interface GameScreenProps {
  category: {
    name: string;
    challenges: string[];
  };
  onBack: () => void;
}

export default function GameScreen({ category, onBack }: GameScreenProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedDare, setSelectedDare] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [lastTouchTime, setLastTouchTime] = useState<number>(Date.now());
  const animationRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (points.length > 0) {
      setLastTouchTime(Date.now());
      setCountdown(5);
    }
  }, [points.length]);

  useEffect(() => {
    if (!isSelecting && !selectedDare) {
      countdownRef.current = setInterval(() => {
        const timeSinceLastTouch = Date.now() - lastTouchTime;
        const remainingSeconds = Math.max(0, 5 - Math.floor(timeSinceLastTouch / 1000));
        
        setCountdown(remainingSeconds);

        if (remainingSeconds === 0 && points.length > 0) {
          clearInterval(countdownRef.current);
          handleStart();
        }
      }, 100);

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [lastTouchTime, isSelecting, selectedDare]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSelecting || selectedDare) return;
    e.preventDefault();

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newPoints = Array.from(e.touches)
      .filter(touch => {
        const touchY = touch.clientY;
        return touchY > rect.top && touchY < rect.bottom;
      })
      .map((touch) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const existingPoint = points.find(p => p.id === touch.identifier);
        
        // If point already exists, keep its properties
        if (existingPoint) {
          return existingPoint;
        }

        // Create new point at exact touch position
        return {
          id: touch.identifier,
          x: touch.pageX,
          y: touch.pageY,
          color: randomColor,
          number: points.length + 1,
          isHighlighted: false,
        };
      });

    setPoints(prevPoints => {
      // Keep existing points that are still being touched
      const existingIds = newPoints.map(p => p.id);
      const remainingPoints = prevPoints.filter(p => existingIds.includes(p.id));
      return [...remainingPoints, ...newPoints.filter(p => !remainingPoints.find(rp => rp.id === p.id))];
    });
    setSelectedPoint(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isSelecting || selectedDare) return;
    e.preventDefault();

    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newPoints = Array.from(e.touches)
      .filter(touch => {
        const touchY = touch.clientY;
        return touchY > rect.top && touchY < rect.bottom;
      })
      .map((touch) => {
        const existingPoint = points.find(p => p.id === touch.identifier);
        return {
          id: touch.identifier,
          x: touch.pageX,
          y: touch.pageY,
          color: existingPoint?.color || colors[Math.floor(Math.random() * colors.length)],
          number: existingPoint?.number || points.length + 1,
          isHighlighted: false,
        };
      });

    setPoints(newPoints);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    // Only clear points if we're not selecting and there's no selected point
    if (!isSelecting && !selectedPoint) {
      if (e.touches.length === 0) {
        setPoints([]);
      } else {
        const remainingIds = Array.from(e.touches).map(touch => touch.identifier);
        setPoints(prev => prev.filter(point => remainingIds.includes(point.id)));
      }
    }
  };

  const handleStart = () => {
    if (points.length === 0) return;
    setIsSelecting(true);
    setSelectedDare(null);

    let iterations = 0;
    const maxIterations = 30;
    const selectedIndex = Math.floor(Math.random() * points.length);
    let currentIndex = 0;

    const animate = () => {
      setPoints(prevPoints => 
        prevPoints.map(p => ({ ...p, isHighlighted: false }))
      );

      const progress = iterations / maxIterations;
      const delay = 100 + (progress * progress * 400);

      setPoints(prevPoints => 
        prevPoints.map((p, i) => ({
          ...p,
          isHighlighted: i === currentIndex,
          isOutlined: i === currentIndex && iterations % 2 === 0 // Alternate between filled and outlined
        }))
      );

      currentIndex = (currentIndex + 1) % points.length;
      iterations++;

      if (iterations < maxIterations) {
        animationRef.current = setTimeout(animate, delay) as unknown as number;
      } else {
        // Final selection - keep only the selected point
        const selectedPoint = points[selectedIndex];
        
        // Keep only the selected point, maintaining its original position
        setPoints([{
          ...selectedPoint,
          isHighlighted: true,
          isOutlined: false
        }]);
        
        // Show dare after delay
        setTimeout(() => {
          const randomDare = category.challenges[Math.floor(Math.random() * category.challenges.length)];
          setSelectedDare(randomDare);
          setIsSelecting(false);
        }, 3000);
      }
    };

    animate();
  };

  const resetGame = () => {
    // First, clear all timers
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    // Then reset all state in one go
    setSelectedDare(null);
    setPoints([]);
    setIsSelecting(false);
    setSelectedPoint(null);
    setCountdown(5);
    setLastTouchTime(Date.now());

    // Clear timer refs
    countdownRef.current = undefined;
    animationRef.current = undefined;
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="min-h-screen flex flex-col select-none" style={backgroundPattern}>
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 backdrop-blur-sm select-none">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold select-none">{category.name}</h1>
        <div className="flex-1" />
        {points.length > 0 && !isSelecting && !selectedDare && (
          <Button 
            onClick={handleStart}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Start ({countdown}s)
          </Button>
        )}
      </div>

      <div 
        ref={gameAreaRef}
        className="flex-1 relative touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ 
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'none'
        }}
      >
        {/* Show points */}
        {points.map(point => (
          <motion.div
            key={point.id}
            className={`fixed rounded-full border-8 transition-all flex items-center justify-center select-none ${
              point.isHighlighted ? 'shadow-lg' : ''
            }`}
            animate={{
              left: selectedDare && point.isHighlighted ? '50vw' : point.x,
              top: selectedDare && point.isHighlighted ? '50vh' : point.y,
              width: selectedDare && point.isHighlighted ? '100vw' : '6rem',
              height: selectedDare && point.isHighlighted ? '100vw' : '6rem',
              x: '-50%',
              y: selectedDare && point.isHighlighted ? '-50%' : '-50%',
              scale: point.isHighlighted && !selectedDare ? 1.25 : 1,
            }}
            initial={{
              left: point.x,
              top: point.y,
              width: '6rem',
              height: '6rem',
              x: '-50%',
              y: '-50%',
              scale: 0,
            }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 200,
              mass: 1,
            }}
            style={{
              borderColor: point.color,
              backgroundColor: selectedDare && point.isHighlighted 
                ? point.color 
                : point.isHighlighted && !selectedDare
                ? point.isOutlined ? 'transparent' : point.color
                : `${point.color}33`,
              borderWidth: point.isHighlighted ? '12px' : '8px',
              transition: 'all 0.15s ease-in-out',
              boxShadow: point.isHighlighted && !selectedDare 
                ? `0 0 30px ${point.color}66` 
                : 'none',
            }}
          >
            {selectedDare && point.isHighlighted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-8 p-8 text-white max-w-2xl mx-auto"
              >
                <p className="text-3xl font-bold text-center">
                  {selectedDare}
                </p>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={handlePlayAgain}
                  className="gap-2 text-lg px-8 bg-white/10 hover:bg-white/20 border-white text-white"
                >
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </Button>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Countdown Display */}
        {points.length > 0 && !isSelecting && !selectedDare && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div
                key={countdown}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-[200px] leading-none font-black text-primary"
                style={{
                  textShadow: '0 0 40px rgba(79, 70, 229, 0.3)',
                  WebkitTextStroke: '2px rgba(79, 70, 229, 0.2)',
                }}
              >
                {countdown}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="text-2xl font-medium text-primary mt-4"
              >
                starting soon
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}