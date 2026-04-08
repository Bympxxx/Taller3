export interface User {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'USER' | 'ADMIN';
  plan?: 'basic' | 'premium' | 'ultimate';
}
