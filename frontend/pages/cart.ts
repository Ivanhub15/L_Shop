import { createElement, clearContainer } from '../utils/dom';
import { store } from '../store/store';
import { cart } from '../api/cart';
import { CartItem, Product } from '../types/types';
import { ProductCard } from '../components/productCard';
import { router } from '../router/router';

export async function CartPage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  clearContainer(app);

  if (!store.isAuthenticated()) {
    const message = createElement('div', { class: 'auth-required' });
    message.innerHTML = '<h2>Please log in to view your cart</h2><a href="/login">Go to Login</a>';
    app.appendChild(message);
    return;
  }

  const page = createElement('div', { class: 'cart-page' });

  const title = createElement('h1', {}, 'Shopping Cart');
  page.appendChild(title);

  const cartContainer = createElement('div', { class: 'cart-container' });

  const itemsList = createElement('div', { class: 'cart-items', id: 'cart-items' });
  const summary = createElement('div', { class: 'cart-summary' });

  const loadCart = async () => {
    try {
      const cartItems = await cart.getCart();
      renderCart(cartItems);
      updateSummary(cartItems);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const renderCart = (cartItems: CartItem[]) => {
    clearContainer(itemsList);

    if (cartItems.length === 0) {
      itemsList.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }

    cartItems.forEach(item => {
      const card = ProductCard({
        product: item,
        isInCart: true,
        cartItem: item,
        showQuantity: true,
        onQuantityChange: async (quantity: number) => {
          try {
            await cart.updateCartItem(item.id, quantity);
            await loadCart();
          } catch (error) {
            alert('Failed to update quantity: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        },
        onAddToCart: async (product?: Product) => {
          try {
            await cart.removeFromCart(item.id);
            await loadCart();
          } catch (error) {
            alert('Failed to remove item: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        },
      });

      // Mark items as in basket for data attributes
      const titleEl = card.querySelector('[data-title]');
      const priceEl = card.querySelector('[data-price]');
      if (titleEl) titleEl.setAttribute('data-title', 'basket');
      if (priceEl) priceEl.setAttribute('data-price', 'basket');

      itemsList.appendChild(card);
    });
  };

  const updateSummary = (cartItems: CartItem[]) => {
    clearContainer(summary);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    summary.innerHTML = `
      <div class="summary-info">
        <p>Items: <span>${cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span></p>
        <p>Total: <span>$${total.toFixed(2)}</span></p>
      </div>
    `;

    const checkoutBtn = createElement('button', { class: 'checkout-btn' }, 'Proceed to Delivery');

    checkoutBtn.addEventListener('click', () => {
      router.navigate('/delivery');
    });

    summary.appendChild(checkoutBtn);
  };

  cartContainer.appendChild(itemsList);
  cartContainer.appendChild(summary);
  page.appendChild(cartContainer);

  app.appendChild(page);

  await loadCart();
}
