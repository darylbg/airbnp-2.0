import { jwtDecode } from "jwt-decode";

class AuthService {
  constructor() {
    this.checkInterval = null; // To hold the interval ID
  }

  // retrieve data saved in token
  getProfile() {
    return jwtDecode(this.getToken());
  }

  // check if user is still logged in
  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    if (!token) {
      return true;
    }
    try {
      // Decode the token to get its expiration time that was set by the server
      const decodedToken = jwtDecode(token);

      // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem("id_token");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    console.log("login function firing", idToken)
    this.startTokenCheck();
    // window.location.assign("/");
  }
  
  logout() {
    return new Promise((resolve) => {
      localStorage.removeItem("id_token");
      localStorage.removeItem("persist:root");
      this.stopTokenCheck();
      resolve();
    });
  }

  startTokenCheck() {
    // Clear any existing interval
    this.stopTokenCheck();

    // Set up periodic check if the user is logged in
    if (this.loggedIn()) {
      this.checkInterval = setInterval(() => {
        if (this.isTokenExpired(this.getToken())) {
          this.logout();
        }
      }, 1000 * 10); // Check every 10 seconds
    }
  }

  stopTokenCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

const authService = new AuthService();
export default authService;

// Initial check if the user is logged in to start the periodic check
if (authService.loggedIn()) {
  authService.startTokenCheck();
}
