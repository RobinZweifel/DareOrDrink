'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import GameScreen from './components/GameScreen';

const categories = [
  {
    id: 'general',
    name: 'General Dares',
    challenges: ['Take a shot', 'Tell a joke', 'Do a dance']
  },
  {
    id: 'physical',
    name: 'Physical Challenges',
    challenges: ['Do 5 pushups', 'Touch your toes', 'Spin around']
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<null | typeof categories[0]>(null);

  if (selectedCategory) {
    return <GameScreen category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
  }

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Choose a Category</h1>
      <div className="max-w-md mx-auto space-y-4">
        {categories.map(category => (
          <Card
            key={category.id}
            className="p-4 cursor-pointer hover:bg-accent"
            onClick={() => setSelectedCategory(category)}
          >
            <h2 className="text-xl font-semibold">{category.name}</h2>
          </Card>
        ))}
      </div>
    </main>
  );
}