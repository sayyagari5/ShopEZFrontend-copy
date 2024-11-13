import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderSummary } from './order-summary';

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

interface CheckoutMenuProps {
  cart: Product[];
  totalPrice: number;
  onClose: () => void;
}

export function CheckoutMenu({ cart, totalPrice, onClose }: CheckoutMenuProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = 123; // Replace with actual user ID
    const trackingId = Math.floor(Math.random() * 1000000); // Example tracking ID
    const amount = totalPrice;
    const amountTax = totalPrice * 0.08; // Example tax calculation

    const orderData = {
      userId,
      trackingId,
      amount,
      amountTax,
      creditCard
    };

    try {
      const response = await fetch('http://localhost:8080/api/transactions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if needed
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('Order created successfully:', data);
        setOrderPlaced(true);
      } else {
        console.error('Order creation failed:', data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (orderPlaced) {
    return (
      <OrderSummary
        name={name}
        email={email}
        address={address}
        cart={cart}
        totalPrice={totalPrice}
        onClose={onClose}
      />
    );
  }
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">ShopEZ</CardTitle>
        </CardHeader>
      </Card>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="font-semibold mt-2">
                Subtotal: ${totalPrice.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditCard">Credit Card Number</Label>
              <Input
                id="creditCard"
                value={creditCard}
                onChange={(e) => setCreditCard(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Place Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}