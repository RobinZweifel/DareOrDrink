import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

export default function CategoryCard({ name, description, icon: Icon, onClick, color }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl cursor-pointer"
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
        </div>
      </div>
    </motion.div>
  );
} 