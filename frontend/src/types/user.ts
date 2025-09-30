export enum UserRole {
  Requester = 'requester',
  Agent = 'agent',
  Manager = 'manager',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
}