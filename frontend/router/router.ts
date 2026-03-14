export class Router {
  private routes: Map<string, () => void> = new Map();
  private currentRoute: string = '/';

  register(path: string, handler: () => void): void {
    this.routes.set(path, handler);
  }

  navigate(path: string): void {
    window.history.pushState(null, '', path);
    this.currentRoute = path;
    this.render();
  }

  render(): void {
    const handler = this.routes.get(this.currentRoute);
    if (handler) {
      handler();
    } else {
      this.routes.get('/')?.();
    }
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }

  start(): void {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.render();
    });

    this.currentRoute = window.location.pathname;
    this.render();
  }
}

export const router = new Router();
