import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
  id: number
  name: string
  price: number
  image: string
}

interface OrderSummaryProps {
  name: string
  email: string
  address: string
  cart: Product[]
  totalPrice: number
  onClose: () => void
}

export function OrderSummary({ name, email, address, cart, totalPrice, onClose }: OrderSummaryProps) {
  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto mb-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">ShopEZ</CardTitle>
        </CardHeader>
      </Card>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Customer Information</h3>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            <p>Address: {address}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Order Details</h3>
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="font-semibold mt-2">
              Total: ${totalPrice.toFixed(2)}
            </div>
          </div>
          <div className="text-center">
            <p className="text-green-600 font-semibold mb-4">
              Thank you for your order! We'll send a confirmation email shortly.
            </p>
            <Button onClick={onClose}>
              Return to Shop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}