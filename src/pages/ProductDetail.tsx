import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
  category_id: string
  categories?: {
    name: string
  }
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('id', id)
        .single()

      if (!error && data) {
        setProduct(data)
      } else {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        })
      }
      setLoading(false)
    }

    fetchProduct()
  }, [id, toast])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <Link to="/">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Low Stock
                </Badge>
              )}
              {product.stock_quantity === 0 && (
                <Badge variant="secondary" className="absolute top-4 right-4">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.categories && (
                <Badge variant="outline" className="mb-2">
                  {product.categories.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-primary mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Stock Available:</span>
                    <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity} units` : 'Out of stock'}
                    </span>
                  </div>

                  {product.stock_quantity > 0 && (
                    <>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                            disabled={quantity >= product.stock_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button
                          size="lg"
                          className="w-full"
                          onClick={handleAddToCart}
                        >
                          <ShoppingCart className="h-5 w-5 mr-2" />
                          Add to Cart - ${(product.price * quantity).toFixed(2)}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span>{product.categories?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per unit:</span>
                    <span>${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className={product.stock_quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail