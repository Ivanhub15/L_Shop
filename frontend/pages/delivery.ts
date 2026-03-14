import { createElement, clearContainer } from '../utils/dom';
import { store } from '../store/store';
import { order } from '../api/order';
import { cart } from '../api/cart';
import { router } from '../router/router';

export async function DeliveryPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  clearContainer(app);

  if (!store.isAuthenticated()) {
    const message = createElement('div', { class: 'auth-required' });
    message.innerHTML = '<h2>Please log in to complete your order</h2><a href="/login">Go to Login</a>';
    app.appendChild(message);
    return;
  }

  const page = createElement('div', { class: 'delivery-page' });

  const title = createElement('h1', {}, 'Delivery Information');
  page.appendChild(title);

  const form = createElement('form', {
    'data-delivery': '',
    class: 'delivery-form',
  }) as HTMLFormElement;

  form.innerHTML = `
    <div class="form-group">
      <label for="address">Address</label>
      <input type="text" id="address" name="address" placeholder="Enter delivery address" required>
    </div>
    <div class="form-group">
      <label for="phone">Phone</label>
      <input type="tel" id="phone" name="phone" placeholder="Enter phone number" required>
    </div>
    <div class="form-group">
      <label for="email">Email</label>
      <input type="email" id="email" name="email" placeholder="Enter email" required>
    </div>
    <div class="form-group">
      <label for="payment">Payment Method</label>
      <select id="payment" name="payment" required>
        <option value="">Select payment method</option>
        <option value="card">Credit Card</option>
        <option value="bank">Bank Transfer</option>
        <option value="cash">Cash on Delivery</option>
      </select>
    </div>
    <button type="submit" class="place-order-btn">Place Order</button>
  `;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const result = await order.createOrder({
        address: formData.get('address') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
      });

      alert('Order placed successfully! Order ID: ' + result.order.orderId);
      router.navigate('/');
    } catch (error) {
      alert('Failed to place order: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  });

  page.appendChild(form);
  app.appendChild(page);
}
