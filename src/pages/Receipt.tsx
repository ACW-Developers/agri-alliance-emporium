import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download, ArrowLeft } from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  total_amount: number
  status: string
  created_at: string
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  products: {
    name: string
    image_url: string
  }
}

const Receipt = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) return

      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (orderError) throw orderError

        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              name,
              image_url
            )
          `)
          .eq('order_id', orderId)

        if (itemsError) throw itemsError

        setOrder(orderData)
        setOrderItems(itemsData)
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading receipt...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="print:hidden mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl text-green-600">Order Confirmed!</CardTitle>
            <p className="text-muted-foreground">Thank you for your purchase</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Company Header */}
            <div className="text-center border-b pb-6">
              <h1 className="text-2xl font-bold">Artificial Intelligence Alliance Agriculture NGO</h1>
              <p className="text-muted-foreground">Supporting Local Farmers & Sustainable Agriculture</p>
            </div>

            {/* Order Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className="capitalize">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {order.customer_email}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
                  <p><span className="text-muted-foreground">Address:</span> {order.delivery_address}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.products.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total Paid:</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground pt-6 border-t">
              <p>Thank you for supporting local agriculture!</p>
              <p>Your order will be processed and delivered within 2-3 business days.</p>
            </div>

            {/* Action Buttons */}
            <div className="print:hidden flex gap-4 justify-center pt-6">
              <Button onClick={handlePrint} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Receipt