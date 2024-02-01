import jwtDecode from "jwt-decode";

class AuthService {
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
    // Decode the token to get its expiration time that was set by the server
    const decodedToken = jwtDecode(token);

    // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem("id_token");
      return true;
    }
    return false;
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  login(idToken) {
    localStorage.setItem("id_token", idToken);
    // if you want to redirect user to a certain page after login 
    // window.location.assign("/");
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("persist:root");
    window.location.reload();
  }
}

export default new AuthService();
