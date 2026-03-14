import { User } from '../types/types';

class Store {
  private currentUser: User | null = null;
  private listeners: Set<() => void> = new Set();

  setCurrentUser(user: User | null): void {
    this.currentUser = user;
    this.notify();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const store = new Store();
