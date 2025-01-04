'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Save } from 'lucide-react';

interface CustomDaresManagerProps {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomDaresManager({ categoryId, isOpen, onClose }: CustomDaresManagerProps) {
  const [customDares, setCustomDares] = useState<string[]>([]);
  const [newDare, setNewDare] = useState('');

  // Load custom dares from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`customDares-${categoryId}`);
    if (stored) {
      setCustomDares(JSON.parse(stored));
    }
  }, [categoryId]);

  // Save to localStorage whenever customDares changes
  useEffect(() => {
    localStorage.setItem(`customDares-${categoryId}`, JSON.stringify(customDares));
  }, [customDares, categoryId]);

  const handleAddDare = () => {
    if (newDare.trim()) {
      setCustomDares([...customDares, newDare.trim()]);
      setNewDare('');
    }
  };

  const handleDeleteDare = (index: number) => {
    setCustomDares(customDares.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Custom Dares</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newDare}
            onChange={(e) => setNewDare(e.target.value)}
            placeholder="Enter a new dare..."
            className="flex-1 px-3 py-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddDare();
              }
            }}
          />
          <Button onClick={handleAddDare}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {customDares.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No custom dares yet. Add some above!</p>
          ) : (
            <ul className="space-y-2">
              {customDares.map((dare, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <span className="flex-1">{dare}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDare(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>
            <Save className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>
      </div>
    </div>
  );
} 