import { Product, CartItem } from '../types/types';
import { cart } from '../api/cart';
import { store } from '../store/store';
import { createElement } from '../utils/dom';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product?: Product) => void | Promise<void>;
  isInCart?: boolean;
  cartItem?: CartItem | null;
  showQuantity?: boolean;
  onQuantityChange?: (quantity: number) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  isInCart = false,
  cartItem,
  showQuantity = false,
  onQuantityChange,
}: ProductCardProps): HTMLElement {
  const container = createElement('div', { class: 'product-card' });

  const title = createElement('h3', { 'data-title': '' }, product.name);
  const description = createElement('p', { class: 'product-description' }, product.description);
  const price = createElement('p', { 'data-price': '', class: 'product-price' }, `$${product.price}`);

  const statusDiv = createElement('div', { class: 'product-status' });
  if (product.available) {
    statusDiv.textContent = 'In Stock';
    statusDiv.classList.add('available');
  } else {
    statusDiv.textContent = 'Out of Stock';
    statusDiv.classList.add('unavailable');
  }

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(price);
  container.appendChild(statusDiv);

  if (store.isAuthenticated()) {
    // On cart page - show quantity controls and remove button
    if (isInCart && showQuantity && cartItem) {
      const quantityDiv = createElement('div', { class: 'quantity-control' });
      const decreaseBtn = createElement('button', { class: 'qty-btn' }, '-');
      const quantityInput = createElement('input', {
        type: 'number',
        class: 'quantity-input',
        value: String(cartItem.quantity),
        min: '1',
      }) as HTMLInputElement;
      const increaseBtn = createElement('button', { class: 'qty-btn' }, '+');

      decreaseBtn.addEventListener('click', () => {
        if (cartItem.quantity > 1) {
          const newQty = cartItem.quantity - 1;
          quantityInput.value = String(newQty);
          onQuantityChange?.(newQty);
        }
      });

      increaseBtn.addEventListener('click', () => {
        const newQty = cartItem.quantity + 1;
        quantityInput.value = String(newQty);
        onQuantityChange?.(newQty);
      });

      quantityDiv.appendChild(decreaseBtn);
      quantityDiv.appendChild(quantityInput);
      quantityDiv.appendChild(increaseBtn);
      container.appendChild(quantityDiv);

      // Remove button on cart page
      const removeBtn = createElement('button', { class: 'remove-btn' }, 'Remove from Cart');
      removeBtn.addEventListener('click', async () => {
        try {
          await onAddToCart?.(); // Delegate to cart page handler which will remove
        } catch (error) {
          console.error('Failed to remove from cart:', error);
          alert('Failed to remove item from cart');
        }
      });
      container.appendChild(removeBtn);
    } 
    // On home page - show quantity input and add button (not in cart)
    else if (!isInCart) {
      const quantityDiv = createElement('div', { class: 'quantity-control' });
      let quantity = 1;

      const quantityInput = createElement('input', {
        type: 'number',
        class: 'quantity-input',
        value: '1',
        min: '1',
      }) as HTMLInputElement;

      quantityInput.addEventListener('change', () => {
        quantity = Math.max(1, parseInt(quantityInput.value) || 1);
        quantityInput.value = String(quantity);
      });

      quantityDiv.appendChild(quantityInput);
      container.appendChild(quantityDiv);

      if (product.available) {
        const addBtn = createElement('button', { class: 'add-to-cart-btn' }, 'Add to Cart');
        addBtn.addEventListener('click', () => {
          onAddToCart?.(product);
          quantityInput.value = '1';
          quantity = 1;
        });
        container.appendChild(addBtn);
      }
    }
  } else {
    const loginPrompt = createElement('p', { class: 'login-prompt' }, 'Sign in to add to cart');
    container.appendChild(loginPrompt);
  }

  return container;
}
