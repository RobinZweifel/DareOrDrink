'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Pencil, Save, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories } from '@/app/data/categories';

export default function EditDaresPage({ params }: { params: { categoryId: string } }) {
  const router = useRouter();
  const category = categories.find(c => c.id === params.categoryId);
  const [dares, setDares] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newDare, setNewDare] = useState('');

  useEffect(() => {
    // Load both default and custom dares
    const customDares = localStorage.getItem(`customDares-${params.categoryId}`);
    const parsedCustomDares = customDares ? JSON.parse(customDares) : [];
    setDares([...(category?.challenges || []), ...parsedCustomDares]);
  }, [params.categoryId, category]);

  const handleSave = () => {
    // Save all dares that aren't in the original category challenges as custom dares
    const originalDares = new Set(category?.challenges || []);
    const customDares = dares.filter(dare => !originalDares.has(dare));
    localStorage.setItem(`customDares-${params.categoryId}`, JSON.stringify(customDares));
    router.back();
  };

  const handleAddDare = () => {
    if (newDare.trim()) {
      setDares([...dares, newDare.trim()]);
      setNewDare('');
    }
  };

  const handleEditDare = (index: number) => {
    setEditingIndex(index);
    setEditingText(dares[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editingText.trim()) {
      const newDares = [...dares];
      newDares[index] = editingText.trim();
      setDares(newDares);
    }
    setEditingIndex(null);
    setEditingText('');
  };

  const handleDeleteDare = (index: number) => {
    setDares(dares.filter((_, i) => i !== index));
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Edit {category.name}</h1>
            <div className="flex-1" />
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newDare}
              onChange={(e) => setNewDare(e.target.value)}
              placeholder="Add a new dare..."
              className="flex-1 px-3 py-2 border rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddDare();
                }
              }}
            />
            <Button onClick={handleAddDare}>
              <Plus className="h-4 w-4 mr-2" />
              Add Dare
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {dares.map((dare, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm border group"
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(index);
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSaveEdit(index)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1">{dare}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditDare(index)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDare(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 