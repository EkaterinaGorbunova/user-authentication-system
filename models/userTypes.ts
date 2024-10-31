export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional, since OAuth users won't have passwords
}