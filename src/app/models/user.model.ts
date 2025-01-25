export interface User {
  id: number; // Optional: Use this if the backend includes an ID field
  username: string;
  email: string;
  password?: string; // Optional: Include this only when creating/updating users
  role: string; // e.g., "USER", "ADMIN"
}
