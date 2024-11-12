"use client"

import { useState } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckoutMenu } from '../components/menu/checkout-menu'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { authApi } from '@/lib/auth-api'

type Product = {
  id: number
  name: string
  price: number
  image: string
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999.99, image: "/images/laptop.jpg?height=200&width=300" },
  { id: 2, name: "Smartphone", price: 499.99, image: "/images/smartphone.jpg?height=200&width=300" },
  { id: 3, name: "Headphones", price: 99.99, image: "/images/headphones.jpg?height=200&width=300" },
]

export default function ShopEZ() {
  const [cart, setCart] = useState<Product[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const [password, setPassword] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNo, setPhoneNo] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [country, setCountry] = useState('')

  const addToCart = (product: Product) => setCart([...cart, product])

  const removeFromCart = (productId: number) =>
    setCart(cart.filter(item => item.id !== productId))

  const totalItems = cart.length
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await authApi.login(email, password)
      localStorage.setItem('token', response.token)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Login failed:', error)
      //add error handling UI here
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = {
        email,
        password,
        customerName,
        phoneNo,
        street,
        city,
        state,
        zipcode,
        country
      };
      
      // Register the user
      const response = await authApi.register(userData);
      
      // If registration successful, login
      const loginResponse = await authApi.login(email, password);
      localStorage.setItem('token', loginResponse.token);
      setIsLoggedIn(true);
      
      console.log('Registration and login successful');
    } catch (error) {
      console.error('Registration failed:', error);
      // Add error handling UI here
    }
  };

  const handleCheckout = () => setIsCheckoutOpen(true)

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md mb-4">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">ShopEZ</CardTitle>
          </CardHeader>
        </Card>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isCreatingAccount ? 'Create Account' : 'Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isCreatingAccount ? (
              <form onSubmit={handleCreateAccount} className="space-y-4">
                {/** Account creation form fields */}
                <InputField label="Full Name" value={customerName} onChange={setCustomerName} required />
                <InputField label="Password" type="password" value={password} onChange={setPassword} required />
                <InputField label="Email" type="email" value={email} onChange={setEmail} required />
                <InputField label="Phone Number" value={phoneNo} onChange={setPhoneNo} required />
                <InputField label="Street Address" value={street} onChange={setStreet} required />
                <InputField label="City" value={city} onChange={setCity} required />
                <InputField label="State" value={state} onChange={setState} required />
                <InputField label="Zipcode" value={zipcode} onChange={setZipcode} required />
                <InputField label="Country" value={country} onChange={setCountry} required />
                <Button type="submit" className="w-full">Create Account</Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {/** Login form fields */}
                <InputField label="Email" type="email" value={email} onChange={setEmail} required />
                <InputField label="Password" type="password" value={password} onChange={setPassword} required />
                <Button type="submit" className="w-full">Login</Button>
              </form>
            )}
            <div className="mt-4 text-center">
              <Button variant="link" onClick={() => setIsCreatingAccount(!isCreatingAccount)} className="text-sm">
                {isCreatingAccount ? 'Back to Login' : 'Create New Account'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCheckoutOpen) {
    return (
      <CheckoutMenu cart={cart} totalPrice={totalPrice} onClose={() => setIsCheckoutOpen(false)} />
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Title Card */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">ShopEZ</CardTitle>
        </CardHeader>
      </Card>
      <Header email={email} totalItems={totalItems} handleCheckout={handleCheckout} cart={cart} removeFromCart={removeFromCart} />
      <ProductGrid products={products} addToCart={addToCart} />
    </div>
  )
}

function InputField({ label, type = "text", value, onChange, required = false }: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} />
    </div>
  )
}

function Header({ email, totalItems, handleCheckout, cart, removeFromCart }: any) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Welcome, {email}!</h1>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <h3 className="font-semibold mb-2">Shopping Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <>
              {cart.map((item: Product) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.name} - ${item.price.toFixed(2)}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button className="w-full mt-4" onClick={handleCheckout}>Checkout</Button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function ProductGrid({ products, addToCart }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product: Product) => (
        <Card key={product.id} className="cursor-pointer" onClick={() => addToCart(product)}>
          <CardContent className="p-4">
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover mb-4 rounded-md" />
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="text-primary">${product.price.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
