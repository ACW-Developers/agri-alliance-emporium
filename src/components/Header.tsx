import { ShoppingCart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onCartClick: () => void
  onMenuClick: () => void
}

export const Header = ({ onCartClick, onMenuClick }: HeaderProps) => {
  const { getTotalItems } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold">AI Alliance Agriculture</h1>
            <p className="text-xs text-muted-foreground">NGO</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-4 w-4" />
            {getTotalItems() > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                {getTotalItems()}
              </Badge>
            )}
            <span className="hidden sm:inline ml-2">Cart</span>
          </Button>
        </div>
      </div>
    </header>
  )
}