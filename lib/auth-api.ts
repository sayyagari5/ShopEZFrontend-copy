interface LoginResponse {
  token: string;
  user: {
    email: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  customerName: string;
  phoneNo: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`http://localhost:8080/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },

  async register(userData: RegisterData): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`http://localhost:8080/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }
}; 