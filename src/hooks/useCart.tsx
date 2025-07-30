import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  name: string
  price: number
  image_url: string
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = localStorage.getItem('cart_session_id')
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      localStorage.setItem('cart_session_id', sessionId)
    }
    return sessionId
  }

  const fetchCartItems = async () => {
    try {
      const sessionId = getSessionId()
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('session_id', sessionId)

      if (error) throw error

      const formattedItems: CartItem[] = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        name: (item.products as any)?.name || '',
        price: parseFloat((item.products as any)?.price || '0'),
        image_url: (item.products as any)?.image_url || ''
      })) || []

      setCartItems(formattedItems)
    } catch (error) {
      console.error('Error fetching cart items:', error)
      toast({
        title: "Error",
        description: "Failed to load cart items",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const sessionId = getSessionId()
      
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId)
        .eq('product_id', productId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            session_id: sessionId,
            product_id: productId,
            quantity
          })

        if (error) throw error
      }

      await fetchCartItems()
      toast({
        title: "Added to cart",
        description: "Item successfully added to your cart"
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    }
  }

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)

      if (error) throw error
      await fetchCartItems()
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      })
    }
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)

      if (error) throw error
      await fetchCartItems()
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart"
      })
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      })
    }
  }

  const clearCart = async () => {
    try {
      const sessionId = getSessionId()
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId)

      if (error) throw error
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  useEffect(() => {
    fetchCartItems()
  }, [])

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems,
    refreshCart: fetchCartItems
  }
}