import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
}

interface SidebarProps {
  selectedCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ selectedCategory, onCategorySelect, isOpen, onClose }: SidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (!error && data) {
        setCategories(data)
      }
    }

    fetchCategories()
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r z-50 transition-transform duration-300 ease-in-out
        md:sticky md:translate-x-0 md:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 hidden md:block">Categories</h2>
            
            <div className="space-y-2">
              <Button
                variant={selectedCategory === null ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onCategorySelect(null)
                  onClose()
                }}
              >
                All Products
              </Button>
              
              <Separator className="my-2" />
              
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onCategorySelect(category.id)
                    onClose()
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}