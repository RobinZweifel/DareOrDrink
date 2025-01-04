'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Point {
  id: number;
  x: number;
  y: number;
  color: string;
  number: number;
  isHighlighted?: boolean;
  isSolid?: boolean;
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
    id: string;
    name: string;
    challenges: string[];
  };
  onBack: () => void;
}

const drinkingDares = [
  'Take a shot of the strongest alcohol available',
  'Finish your entire drink in one go',
  'Buy a round of shots for everyone in the group',
  'Take two consecutive shots without a chaser',
  'Sip from someone else\'s drink until they stop you',
  'Drink a mix of three random liquors chosen by the group',
  'Pay for the next round of drinks for the group',
  'Chug a beer or glass of wine within 10 seconds',
  'Drink from a random glass on the table (blindfolded)',
  'Take a shot with your non-dominant hand only',
  'Mix a shot with a condiment (like ketchup or hot sauce) and drink it',
  'Drink every time someone says "no" for the next three minutes',
  'Take a drink while balancing on one foot',
  'Let the group choose your next drink (it must be gross)',
  'Drink every time someone laughs for the next five minutes',
  'Add a shot of liquor to your current drink and finish it',
  'Share a drink with the person to your right, Lady and the Tramp style',
  'Take a double shot of anything clear (vodka, gin, etc.)',
  'Drink every time your name is said until your next turn',
  'Pour some of your drink into someone else\'s glass and finish theirs'
];

const categoryDrinkingDares = {
  'bar-club': [
    'Pay for the next round of drinks for the group',
    'Take a shot of the strongest alcohol available',
    'Buy a round of shots for everyone',
    'Drink a mix of three random liquors chosen by the group',
    'Chug a beer within 10 seconds',
    'Take a shot with your non-dominant hand',
    'Let the bartender choose your next drink',
    'Order the most expensive drink at the bar'
  ],
  'home-party': [
    'Take two shots back to back',
    'Finish your drink in one go',
    'Let someone mix you a mystery drink',
    'Drink every time someone laughs for 2 minutes',
    'Play rock paper scissors - loser drinks',
    'Do a handstand and take a drink (with help)',
    'Take a drink while someone else holds your glass',
    'Let everyone add something to your drink'
  ],
  'restaurant': [
    'Order a drink without looking at the menu',
    'Drink your beverage without using your hands',
    'Take a shot of hot sauce instead of alcohol',
    'Let the waiter choose your drink',
    'Finish everyone\'s drinks at the table',
    'Order the most colorful cocktail available',
    'Drink with your pinky up for the rest of the meal',
    'Mix all your table\'s drinks together and take a sip'
  ],
  'date-night': [
    'Share one drink with two straws',
    'Take body shots off each other',
    'Play "never have I ever" - 3 rounds',
    'Feed each other drinks without using hands',
    'Create and drink a romantic cocktail together',
    'Take turns guessing each other\'s drinks blindfolded',
    'Drink every time your partner compliments you',
    'Mix each other\'s perfect drink'
  ]
};

export default function GameScreen({ category, onBack }: GameScreenProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedDare, setSelectedDare] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [lastTouchTime, setLastTouchTime] = useState<number>(Date.now());
  const [customDares, setCustomDares] = useState<string[]>([]);
  const animationRef = useRef<number>();
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<NodeJS.Timeout>();

  // Load custom dares from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`customDares-${category.id}`);
    if (stored) {
      setCustomDares(JSON.parse(stored));
    }
  }, [category.id]);

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
    // Only clear points if we're not selecting and there's no dare showing
    if (!isSelecting && !selectedDare) {
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
    const maxIterations = 20; // Reduced from 40 to 20 for faster selection
    const selectedIndex = Math.floor(Math.random() * points.length);
    let currentIndex = 0;

    const animate = () => {
      // Calculate delay that increases over time for slowing effect
      const progress = iterations / maxIterations;
      const delay = 25 + (progress * progress * 400); // Reduced initial delay from 50 to 25, and max slowdown from 800 to 400

      // Make all circles outlined except the current one
      setPoints(prevPoints =>
        prevPoints.map((p, i) => ({
          ...p,
          isHighlighted: i === currentIndex,
          isSolid: i === currentIndex
        }))
      );

      // Move to next circle
      currentIndex = (currentIndex + 1) % points.length;
      iterations++;

      if (iterations < maxIterations || currentIndex !== selectedIndex) {
        // Keep going until we hit both the minimum iterations AND land on the selected index
        animationRef.current = setTimeout(animate, delay) as unknown as number;
      } else {
        // Final selection - keep the selected point solid
        setPoints(prevPoints =>
          prevPoints.map((p, i) => ({
            ...p,
            isHighlighted: i === selectedIndex,
            isSolid: i === selectedIndex
          }))
        );

        // Show dare after delay
        setTimeout(() => {
          setPoints([{
            ...points[selectedIndex],
            isHighlighted: true,
            isSolid: true
          }]);

          // Combine default challenges with custom dares
          const allChallenges = [...category.challenges, ...customDares];
          const randomDare = allChallenges[Math.floor(Math.random() * allChallenges.length)];
          setSelectedDare(randomDare);
          setIsSelecting(false);
        }, 700); // Reduced from 1000 to 500ms
      }
    };

    animate();
  };

  const resetGame = () => {
    console.log('resetGame');

    // First, clear all timers
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = undefined;
    }
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = undefined;
    }

    // Reset all state in one go
    setPoints([]);
    setSelectedDare(null);
    setSelectedPoint(null);
    setIsSelecting(false);
    setCountdown(5);
    setLastTouchTime(Date.now());

    // Force a re-render delay to ensure clean state
    setTimeout(() => {
      if (gameAreaRef.current) {
        gameAreaRef.current.style.display = 'none';
        requestAnimationFrame(() => {
          if (gameAreaRef.current) {
            gameAreaRef.current.style.display = 'block';
          }
        });
      }
    }, 0);
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleChickenClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const categoryDares = categoryDrinkingDares[category.id as keyof typeof categoryDrinkingDares] || categoryDrinkingDares['home-party'];
    const randomDrinkingDare = categoryDares[Math.floor(Math.random() * categoryDares.length)];
    setSelectedDare(randomDrinkingDare);
  };

  return (
    <div className="fixed inset-0 flex flex-col select-none overflow-hidden" style={backgroundPattern}>
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 backdrop-blur-sm select-none z-50">
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
        className="flex-1 relative touch-none select-none overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'none',
          height: 'calc(100vh - 73px)' // Account for header height
        }}
      >
        {/* Show points */}
        {points.map(point => (
          <motion.div
            key={point.id}
            className={`fixed rounded-full border-8 transition-all flex items-center justify-center select-none ${point.isHighlighted ? 'shadow-lg' : ''
              }`}
            animate={{
              left: selectedDare && point.isHighlighted ? '50vw' : point.x,
              top: selectedDare && point.isHighlighted ? '50vh' : point.y,
              width: selectedDare && point.isHighlighted ? '100vw' : '8rem',
              height: selectedDare && point.isHighlighted ? '100vw' : '8rem',
              x: '-50%',
              y: selectedDare && point.isHighlighted ? '-50%' : '-50%',
              scale: point.isHighlighted && !selectedDare ? 1.25 : 1,
            }}
            initial={{
              left: point.x,
              top: point.y,
              width: '8rem',
              height: '8rem',
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
                : point.isSolid
                  ? point.color
                  : 'transparent',
              borderWidth: '8px',
              transition: 'all 0.15s ease-in-out',
              boxShadow: point.isHighlighted
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
                <div className="flex flex-col gap-4 w-full items-center">
                  <button
                    onClick={handleChickenClick}
                    onTouchEnd={handleChickenClick}
                    className="gap-2 text-base px-6 py-2 bg-white/10 hover:bg-white/20 border border-white text-white w-full max-w-sm rounded-md flex items-center justify-center active:bg-white/30"
                  >
                    🐔 Chicken (Take a Drink Instead)
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePlayAgain();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePlayAgain();
                    }}
                    className="gap-2 text-base px-6 py-2 bg-white/10 hover:bg-white/20 border border-white text-white w-full max-w-sm rounded-md flex items-center justify-center active:bg-white/30"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Play Again
                  </button>
                </div>
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