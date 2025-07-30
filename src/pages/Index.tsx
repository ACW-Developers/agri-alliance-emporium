import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Header } from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { ProductCard } from '@/components/ProductCard'
import { CartDrawer } from '@/components/CartDrawer'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  category_id: string
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (!error && data) {
        setProducts(data)
        setFilteredProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Fresh African Agriculture</h1>
              <p className="text-xl text-muted-foreground mb-6">
                Supporting local farmers with traditional African greens and organic produce
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default Index