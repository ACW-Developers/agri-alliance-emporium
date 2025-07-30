import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Link } from 'react-router-dom'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  stock_quantity: number
}

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id)
  }

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="aspect-square relative mb-4 overflow-hidden rounded-md">
            <img
              src={product.image_url}
              alt={product.name}
              className="object-cover w-full h-full hover:scale-105 transition-transform"
            />
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Low Stock
              </Badge>
            )}
            {product.stock_quantity === 0 && (
              <Badge variant="secondary" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}