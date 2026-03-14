import { createElement } from '../utils/dom';
import { store } from '../store/store';
import { auth } from '../api/auth';
import { router } from '../router/router';

export function AuthForm(isLogin: boolean = false): HTMLElement {
  const container = createElement('div', { class: 'auth-container' });
  const form = createElement('form', {
    'data-registration': '',
    class: 'auth-form',
  }) as HTMLFormElement;

  form.innerHTML = `
    <h2>${isLogin ? 'Login' : 'Register'}</h2>
    ${!isLogin ? `
      <input type="text" name="name" placeholder="Full Name" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="tel" name="phone" placeholder="Phone" required>
    ` : ''}
    <input type="text" name="login" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button type="submit">${isLogin ? 'Login' : 'Register'}</button>
    <p class="auth-toggle">
      ${isLogin
        ? `Don't have an account? <a href="/register">Register</a>`
        : `Already have an account? <a href="/login">Login</a>`
      }
    </p>
  `;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      let user;
      if (isLogin) {
        user = await auth.login({
          login: formData.get('login') as string,
          password: formData.get('password') as string,
        });
      } else {
        user = await auth.register({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          login: formData.get('login') as string,
          phone: formData.get('phone') as string,
          password: formData.get('password') as string,
        });
      }

      store.setCurrentUser(user);
      router.navigate('/');
    } catch (error) {
      alert(`${isLogin ? 'Login' : 'Registration'} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  container.appendChild(form);
  return container;
}
