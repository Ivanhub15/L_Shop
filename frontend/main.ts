import { Router, router } from './router/router';
import { store } from './store/store';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/home';
import { CartPage } from './pages/cart';
import { DeliveryPage } from './pages/delivery';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { auth } from './api/auth';
import { createElement, clearContainer } from './utils/dom';

async function initApp(): Promise<void> {
  // Try to restore user session
  try {
    const user = await auth.getCurrentUser();
    store.setCurrentUser(user);
  } catch (error) {
    console.log('No active session');
  }

  // Setup routes
  router.register('/', HomePage);
  router.register('/cart', CartPage);
  router.register('/delivery', DeliveryPage);
  router.register('/login', LoginPage);
  router.register('/register', RegisterPage);

  // Render navbar and app container
  const body = document.body;
  clearContainer(body);

  const navbar = Navbar();
  body.appendChild(navbar);

  const app = createElement('div', { id: 'app', class: 'app-container' });
  body.appendChild(app);

  // Subscribe to store changes to update navbar
  store.subscribe(() => {
    clearContainer(navbar);
    const newNavbar = Navbar();
    navbar.replaceWith(newNavbar);
  });

  // Start router
  router.start();
}

document.addEventListener('DOMContentLoaded', initApp);
