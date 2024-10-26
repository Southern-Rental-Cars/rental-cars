import Cookies from 'js-cookie'; // Import Cookies

// Check if the user is authenticated
export function isAuthenticated(): boolean {
  const token = Cookies.get('token'); // Get the JWT token from cookies
  return Boolean(token); // Return true if token exists, false otherwise
}
