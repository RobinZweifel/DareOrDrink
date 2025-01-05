'use client';

import { motion } from 'framer-motion';
import { LucideIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

export default function CategoryCard({ id, name, description, icon: Icon, onClick, color }: CategoryCardProps) {
  const router = useRouter();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/edit-dares/${id}`);
  };

  return (
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
            onClick={handleEditClick}
            style={{ color: color }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
} 