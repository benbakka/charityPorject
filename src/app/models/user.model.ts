export interface Permission {
  route: string;
  canAccess: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  roles?: string[];
  permissions?: Permission[];
}
