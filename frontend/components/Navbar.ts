import { createElement } from '../utils/dom';
import { store } from '../store/store';
import { auth } from '../api/auth';
import { router } from '../router/router';

export function Navbar(): HTMLElement {
  const nav = createElement('nav', { class: 'navbar' });
  const container = createElement('div', { class: 'nav-container' });
  const logo = createElement('h1', { class: 'nav-logo' });
  const logoLink = createElement('a', { href: '/' }, 'L_Shop');
  logo.appendChild(logoLink);

  const links = createElement('div', { class: 'nav-links' });
  const homeLink = createElement('a', { href: '/', class: 'nav-link' }, 'Home');

  const cartLink = createElement('a', { href: '/cart', class: 'nav-link' }, 'Cart');
  const user = store.getCurrentUser();

  const authDiv = createElement('div', { class: 'nav-auth' });

  if (user) {
    const userInfo = createElement('span', { class: 'user-info' }, `Hi, ${user.name}`);
    const logoutBtn = createElement('button', { class: 'logout-btn' }, 'Logout');

    logoutBtn.addEventListener('click', async () => {
      try {
        await auth.logout();
        store.setCurrentUser(null);
        router.navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    });

    authDiv.appendChild(userInfo);
    authDiv.appendChild(logoutBtn);
  } else {
    const loginLink = createElement('a', { href: '/login', class: 'nav-link' }, 'Login');
    const registerLink = createElement('a', { href: '/register', class: 'nav-link' }, 'Register');
    authDiv.appendChild(loginLink);
    authDiv.appendChild(registerLink);
  }

  links.appendChild(homeLink);
  links.appendChild(cartLink);
  links.appendChild(authDiv);

  container.appendChild(logo);
  container.appendChild(links);
  nav.appendChild(container);

  // Add click handlers for SPA navigation
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e: Event) => {
      const href = (e.target as HTMLAnchorElement).href;
      const path = new URL(href).pathname;
      e.preventDefault();
      router.navigate(path);
    });
  });

  return nav;
}
