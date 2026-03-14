import { createElement, clearContainer } from '../utils/dom';
import { AuthForm } from '../components/AuthForm';

export async function RegisterPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  clearContainer(app);

  const page = createElement('div', { class: 'auth-page' });
  page.appendChild(AuthForm(false));

  app.appendChild(page);
}
