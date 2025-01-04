'use client';

import { Category } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Flame, Sparkles } from 'lucide-react';

interface CategorySelectionProps {
  categories: Category[];
  onSelect: (category: Category) => void;
}

const icons = {
  truth: Brain,
  dare: Flame,
  random: Sparkles,
};

export default function CategorySelection({ categories, onSelect }: CategorySelectionProps) {
  return (
    <div className="grid gap-4 p-4">
      {categories.map((category) => {
        const Icon = icons[category.id as keyof typeof icons];
        return (
          <Card
            key={category.id}
            className="transform transition-all hover:scale-105"
            onClick={() => onSelect(category)}
          >
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Icon className="h-8 w-8" />
                <h2 className="text-xl font-bold">{category.name}</h2>
              </div>
              <Button variant="ghost">Select</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}