"use client"

import { useState, useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckoutMenu } from '../components/menu/checkout-menu'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover"
import { authApi } from '@/lib/auth-api'
import { setupSessionTimeout } from '@/lib/sessionUtils'

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
   const [isOtpVerified, setIsOtpVerified] = useState(false)
   const [otp, setOtp] = useState('')
   const [otpError, setOtpError] = useState('')

   const [password, setPassword] = useState('')
   const [passwordError, setPasswordError] = useState('')
   const [customerName, setCustomerName] = useState('')
   const [email, setEmail] = useState('')
   const [phoneNo, setPhoneNo] = useState('')
   const [phoneError, setPhoneError] = useState('')
   const [street, setStreet] = useState('')
   const [streetError, setStreetError] = useState('')
   const [city, setCity] = useState('')
   const [cityError, setCityError] = useState('')
   const [state, setState] = useState('')
   const [stateError, setStateError] = useState('')
   const [zipcode, setZipcode] = useState('')
   const [zipcodeError, setZipcodeError] = useState('')
   const [country, setCountry] = useState('')
   const [countryError, setCountryError] = useState('')

   const passwordRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
   const phoneInputValidation = /^\+?\d{10,15}$/
   const streetInputValidation = /^[a-zA-Z0-9\s,.'-]{5,}$/
   const cityInputValidation = /^[a-zA-Z\s-]{2,}$/
   const stateInputValidation = /^[a-zA-Z]{2}$/;
   const zipcodeInputValidation = /^\d{5}$/
   const countryInputValidation = /^[a-zA-Z\s-]{4,}$/

   const validatePassword = (password: string) => {
      if (!passwordRequirements.test(password)) {
         setPasswordError(
            'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character (!, @, #, etc.)'
         );
         return false;
      }
      setPasswordError('');
      return true;
   }

   const validatePhoneNumber = (phoneNo: string): boolean => {
      if (!phoneInputValidation.test(phoneNo)) {
         setPhoneError(
             'Please enter a valid phone number. Phone number must be 10-15 digits long (1234567890, 123-456-7890, +1 123 456 7890, etc.)'
         );
      return false;
      }
   setPhoneError('')
   return true;
   }

   const validateStreetAddress = (street: string): boolean => {
      if (!streetInputValidation.test(street)) {
         setStreetError(
             'Please enter a valid street address. Street address must be at least 5 characters long'
         );
      return false;
      }
   setStreetError('')
   return true;
   }

   const validateCity = (city: string): boolean => {
      if (!cityInputValidation.test(city)) {
         setCityError(
             'Please enter a valid city. (Can only contain letters, spaces, or dashes)'
         );
      return false;
      }
   setCityError('')
   return true;
   }

   const validateState = (state: string): boolean => {
      if (!stateInputValidation.test(state)) {
         setStateError(
             'Please enter a valid 2-letter state abbreviation'
         );
      return false;
      }
   setStateError('')
   return true;
   }

   const validateZipcode = (zipcode: string): boolean => {
      if (!zipcodeInputValidation.test(zipcode)) {
         setZipcodeError(
             'Please enter a valid zipcode. Must be 5 digits (12345, etc.)'
         );
      return false;
      }
   setZipcodeError('')
   return true;
   }

   const validateCountry = (country: string): boolean => {
      if (!countryInputValidation.test(country)) {
         setCountryError(
             'Please enter a valid country. (Can only contain letters, spaces, or dashes)'
         );
      return false;
      }
   setCountryError('')
   return true;
   }

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
         localStorage.setItem('email', email)
         setIsLoggedIn(true)
      } catch (error) {
         console.error('Login failed:', error)
         //add error handling UI here
      }
   }

   const handleOtpVerification = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
         const email = localStorage.getItem('email')
         const response = await fetch(`http://localhost:8080/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
         })
         const data = await response.json()
         if (data.success) {
            setIsOtpVerified(true)
         } else {
            setOtpError(data.message || 'Invalid OTP')
         }
      } catch (err) {
         setOtpError('Server error')
      }
   }

   const handleCreateAccount = async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate password
      if (!validatePassword(password)) {
         return;
      }

      // Validate phone number
      if (!validatePhoneNumber(phoneNo)) {
         return;
      }

      // Validate street address
      if (!validateStreetAddress(street)) {
         return;
      }

      // Validate city
      if (!validateCity(city)) {
         return;
      }

      // Validate state
      if (!validateState(state)) {
         return;
      }

      // Validate zipcode
      if (!validateZipcode(zipcode)) {
         return;
      }

      // Validate country
      if (!validateCountry(country)) {
         return;
      }

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

   const router = useRouter()

   useEffect(() => {
      if (isLoggedIn && isOtpVerified) {
         const timeoutId = setupSessionTimeout(() => {
            setIsLoggedIn(false)
            setIsOtpVerified(false)
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            router.push('/')
         })

         return () => {
            clearTimeout(timeoutId)
         }
      }
   }, [isLoggedIn, isOtpVerified, router])

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
                        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                        <InputField label="Email" type="email" value={email} onChange={setEmail} required />
                        <InputField label="Phone Number" value={phoneNo} onChange={setPhoneNo} required />
                        {phoneError && <p className="text-red-500 text-sm mt-2">{phoneError}</p>}
                        <InputField label="Street Address" value={street} onChange={setStreet} required />
                        {streetError && <p className="text-red-500 text-sm mt-2">{streetError}</p>}
                        <InputField label="City" value={city} onChange={setCity} required />
                        {cityError && <p className="text-red-500 text-sm mt-2">{cityError}</p>}
                        <InputField label="State" value={state} onChange={setState} required />
                        {stateError && <p className="text-red-500 text-sm mt-2">{stateError}</p>}
                        <InputField label="Zipcode" value={zipcode} onChange={setZipcode} required />
                        {zipcodeError && <p className="text-red-500 text-sm mt-2">{zipcodeError}</p>}
                        <InputField label="Country" value={country} onChange={setCountry} required />
                        {countryError && <p className="text-red-500 text-sm mt-2">{countryError}</p>}
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

   if (isLoggedIn && !isOtpVerified) {
      return (
         <div style={styles.container}>
            <div style={styles.card}>
               <h1 style={styles.title}>Verification</h1>
               <p style={styles.subtitle}>A one-time password was sent to your email</p>
               <form onSubmit={handleOtpVerification} style={styles.form}>
                  <input
                     type="text"
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     placeholder="Enter OTP"
                     required
                     style={styles.input}
                  />
                  <button type="submit" style={styles.button}>Verify</button>
               </form>
               {otpError && <p style={styles.error}>{otpError}</p>}
            </div>
         </div>
      )
   }

   if (isCheckoutOpen) {
      return (
         <CheckoutMenu cart={cart} totalPrice={totalPrice} onClose={() => setIsCheckoutOpen(false)} />
      )
   }

   if (isLoggedIn && isOtpVerified) {
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

const styles = {
   container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f4f9',
   },
   card: {
      width: '400px',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
   },
   title: {
      fontSize: '26px',
      color: '#000000',
      fontWeight: 'bold' as const,
      marginBottom: '0.5rem',
   },
   subtitle: {
      fontSize: '15px',
      color: '#555',
      marginBottom: '1.5rem',
   },
   form: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
   },
   input: {
      padding: '10px',
      fontSize: '16px',
      color: '#000000',
      borderRadius: '4px',
      border: '1px solid #ddd',
      width: '100%',
      marginBottom: '1rem',
      boxSizing: 'border-box' as const,
   },
   button: {
      padding: '10px',
      fontSize: '15px',
      color: '#ffffff',
      backgroundColor: '#000000',
      borderRadius: '7px',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
   },
   error: {
      color: 'red',
      marginTop: '1rem',
      fontSize: '14px',
      fontWeight: 'bold',
   },
};