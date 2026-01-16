

class AuthService {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
  }


  async login(email, password) {
    try {
      console.log('Login called with:', email);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      // const response = await apiService.post('/auth/register', userData);
      console.log('Register called with:', userData);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

 
  async logout() {
    try {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      console.log('Token refreshed');
      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }


  getUser() {
    return this.user;
  }


  getToken() {
    return this.token;
  }


  isLoggedIn() {
    return this.isAuthenticated;
  }
}

export default new AuthService();
