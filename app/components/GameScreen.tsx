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
  const animationRef = useRef<number>();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelecting || selectedDare) return; // Prevent adding points while selecting or showing dare
    
    const rect = e.currentTarget.getBoundingClientRect();
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newPoint = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: randomColor,
      number: points.length + 1,
      isHighlighted: false,
    };
    setPoints([...points, newPoint]);
  };

  const handleStart = () => {
    if (points.length === 0) return;
    setIsSelecting(true);
    setSelectedDare(null);

    let iterations = 0;
    const maxIterations = 30; // Total number of flashes
    const selectedIndex = Math.floor(Math.random() * points.length);
    let currentIndex = 0;

    const animate = () => {
      // Clear previous highlight
      setPoints(prevPoints => 
        prevPoints.map(p => ({ ...p, isHighlighted: false }))
      );

      // Calculate delay based on progress (starts fast, gets slower)
      const progress = iterations / maxIterations;
      const delay = 100 + (progress * progress * 400); // 100ms to 500ms

      // Highlight next point
      setPoints(prevPoints => 
        prevPoints.map((p, i) => ({
          ...p,
          isHighlighted: i === currentIndex
        }))
      );

      currentIndex = (currentIndex + 1) % points.length;
      iterations++;

      // Continue animation or finish
      if (iterations < maxIterations) {
        animationRef.current = setTimeout(animate, delay) as unknown as number;
      } else {
        // Final selection
        setPoints(prevPoints => 
          prevPoints.map((p, i) => ({
            ...p,
            isHighlighted: i === selectedIndex
          }))
        );
        
        // After a pause, show only the selected point and display a dare
        setTimeout(() => {
          setPoints(prevPoints => 
            prevPoints.filter((_, i) => i === selectedIndex)
          );
          const randomDare = category.challenges[Math.floor(Math.random() * category.challenges.length)];
          setSelectedDare(randomDare);
          setIsSelecting(false);
        }, 1000);
      }
    };

    // Start animation
    animate();
  };

  const handlePlayAgain = () => {
    setPoints([]);
    setSelectedDare(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">{category.name}</h1>
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

      {/* Game Area */}
      <div 
        className="flex-1 relative cursor-pointer" 
        onClick={handleClick}
      >
        {points.map(point => (
          <div
            key={point.id}
            className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 transition-all flex items-center justify-center ${
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
            }}
          >
            <span 
              className="text-3xl font-bold transition-colors" 
              style={{ 
                color: point.isHighlighted ? 'white' : point.color 
              }}
            >
              {point.number}
            </span>
          </div>
        ))}

        {/* Dare Display */}
        <AnimatePresence>
          {selectedDare && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className="w-4/5 max-w-lg">
                <Card className="p-8 text-center">
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