'use client';

import { motion } from 'framer-motion';
import { LucideIcon, Settings } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CustomDaresManager from './CustomDaresManager';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

export default function CategoryCard({ id, name, description, icon: Icon, onClick, color }: CategoryCardProps) {
  const [isCustomDaresOpen, setIsCustomDaresOpen] = useState(false);

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCustomDaresOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden rounded-xl cursor-pointer group"
        onClick={onClick}
      >
        <div 
          className="p-6 h-full"
          style={{
            backgroundColor: `${color}10`,
            border: `2px solid ${color}20`,
          }}
        >
          <div className="flex items-start gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleSettingsClick}
              style={{ color: color }}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <CustomDaresManager
        categoryId={id}
        isOpen={isCustomDaresOpen}
        onClose={() => setIsCustomDaresOpen(false)}
      />
    </>
  );
} 