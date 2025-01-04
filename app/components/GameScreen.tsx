'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Point {
  id: number;
  x: number;
  y: number;
  color: string;
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
  };
  onBack: () => void;
}

export default function GameScreen({ category, onBack }: GameScreenProps) {
  const [points, setPoints] = useState<Point[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newPoint = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: randomColor,
    };
    setPoints([...points, newPoint]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">{category.name}</h1>
      </div>

      {/* Game Area */}
      <div 
        className="flex-1 relative cursor-pointer" 
        onClick={handleClick}
      >
        {points.map(point => (
          <div
            key={point.id}
            className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 transition-all"
            style={{
              left: point.x,
              top: point.y,
              borderColor: point.color,
              backgroundColor: `${point.color}33`, // Add transparency to the background
            }}
          />
        ))}
      </div>
    </div>
  );
}