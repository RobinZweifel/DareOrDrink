'use client';

import { useState, useRef } from 'react';
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
  const animationRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);

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
      .map((touch, index) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return {
          id: touch.identifier,
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          color: randomColor,
          number: index + 1,
          isHighlighted: false,
        };
      });

    setPoints(newPoints);
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
      .map((touch, index) => {
        const existingPoint = points.find(p => p.id === touch.identifier);
        return {
          id: touch.identifier,
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top,
          color: existingPoint?.color || colors[Math.floor(Math.random() * colors.length)],
          number: existingPoint?.number || index + 1,
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
          isHighlighted: i === currentIndex
        }))
      );

      currentIndex = (currentIndex + 1) % points.length;
      iterations++;

      if (iterations < maxIterations) {
        animationRef.current = setTimeout(animate, delay) as unknown as number;
      } else {
        // Final selection
        const finalPoints = points.map((p, i) => ({
          ...p,
          isHighlighted: i === selectedIndex
        }));
        setPoints(finalPoints);
        
        // Store the selected point
        setSelectedPoint(finalPoints[selectedIndex]);
        
        // Keep only the selected point after a delay
        setTimeout(() => {
          setPoints([finalPoints[selectedIndex]]);
          
          // Wait 3 seconds before showing the dare
          setTimeout(() => {
            const randomDare = category.challenges[Math.floor(Math.random() * category.challenges.length)];
            setSelectedDare(randomDare);
            setIsSelecting(false);
          }, 3000);
        }, 1000);
      }
    };

    animate();
  };

  const handlePlayAgain = () => {
    setPoints([]);
    setSelectedDare(null);
    setSelectedPoint(null);
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
            Start
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
        {/* Show either the active points or the selected point */}
        {(selectedPoint ? [selectedPoint] : points).map(point => (
          <div
            key={point.id}
            className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 transition-all flex items-center justify-center select-none ${
              point.isHighlighted ? 'scale-125 shadow-lg' : 'scale-100'
            }`}
            style={{
              left: point.x,
              top: point.y,
              borderColor: point.color,
              backgroundColor: point.isHighlighted 
                ? point.color 
                : `${point.color}33`,
              transition: 'all 0.15s ease-in-out',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
            }}
          >
            <span 
              className="text-3xl font-bold transition-colors select-none" 
              style={{ 
                color: point.isHighlighted ? 'white' : point.color,
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
              }}
            >
              {point.number}
            </span>
          </div>
        ))}

        <AnimatePresence>
          {selectedDare && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className="w-4/5 max-w-lg">
                <Card className="p-8 text-center shadow-xl">
                  <p className="text-2xl font-bold mb-8">{selectedDare}</p>
                  <Button 
                    size="lg"
                    onClick={handlePlayAgain}
                    className="gap-2 text-lg px-8"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Play Again
                  </Button>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}