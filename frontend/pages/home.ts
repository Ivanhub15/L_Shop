import { createElement, clearContainer } from '../utils/dom';
import { store } from '../store/store';
import { auth } from '../api/auth';
import { cart } from '../api/cart';
import { products } from '../api/products';
import { Product, CartItem } from '../types/types';
import { ProductCard } from '../components/productCard';
import { router } from '../router/router';

export async function HomePage(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  clearContainer(app);

  const page = createElement('div', { class: 'home-page' });

  // Filters Section
  const filtersSection = createElement('div', { class: 'filters-section' });

  const searchInput = createElement('input', {
    id: 'search',
    type: 'text',
    placeholder: 'Search products...',
    class: 'search-input',
  }) as HTMLInputElement;

  const categorySelect = createElement('select', {
    id: 'category',
    class: 'category-select',
  }) as HTMLSelectElement;
  categorySelect.innerHTML = `
    <option value="">All categories</option>
    <option value="clothes">Clothes</option>
    <option value="electronics">Electronics</option>
  `;

  const sortSelect = createElement('select', {
    id: 'sort',
    class: 'sort-select',
  }) as HTMLSelectElement;
  sortSelect.innerHTML = `
    <option value="">Sort by</option>
    <option value="price_asc">Price: Low to High</option>
    <option value="price_desc">Price: High to Low</option>
  `;

  const availabilityCheckbox = createElement('label', { class: 'availability-label' });
  const checkbox = createElement('input', {
    id: 'available',
    type: 'checkbox',
    class: 'availability-check',
  });
  availabilityCheckbox.appendChild(checkbox);
  availabilityCheckbox.appendChild(document.createTextNode(' In Stock Only'));

  filtersSection.appendChild(searchInput);
  filtersSection.appendChild(categorySelect);
  filtersSection.appendChild(sortSelect);
  filtersSection.appendChild(availabilityCheckbox);

  page.appendChild(filtersSection);

  // Products Grid
  const productsGrid = createElement('div', { class: 'products-grid', id: 'products-grid' });
  page.appendChild(productsGrid);

  app.appendChild(page);

  // Load and display products
  let allProducts: Product[] = [];
  let cartItems: CartItem[] = [];

  const loadProducts = async () => {
    try {
      const search = searchInput.value;
      const category = categorySelect.value || undefined;
      const sort = sortSelect.value as 'price_asc' | 'price_desc' | undefined;
      const available = checkbox.checked ? true : undefined;

      allProducts = await products.getAll({
        search: search || undefined,
        category,
        available,
        sort,
      });

      if (store.isAuthenticated()) {
        cartItems = await cart.getCart();
      }

      renderProducts();
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const renderProducts = () => {
    clearContainer(productsGrid);

    allProducts.forEach(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      const isInCart = !!cartItem;

      const card = ProductCard({
        product,
        isInCart,
        cartItem: cartItem || null,
        onAddToCart: async (prod?: Product) => {
          try {
            const qty = parseInt(
              (card.querySelector('.quantity-input') as HTMLInputElement)?.value || '1'
            );
            await cart.addToCart(prod?.id || 0, qty);
            await loadProducts();
          } catch (error) {
            alert('Failed to add to cart: ' + (error instanceof Error ? error.message : 'Unknown error'));
          }
        },
      });

      productsGrid.appendChild(card);
    });
  };

  // Event listeners
  searchInput.addEventListener('input', loadProducts);
  categorySelect.addEventListener('change', loadProducts);
  sortSelect.addEventListener('change', loadProducts);
  checkbox.addEventListener('change', loadProducts);

  // Subscribe to store changes
  const unsubscribe = store.subscribe(loadProducts);

  await loadProducts();

  // Cleanup on page leave
  (window as any)._homePageCleanup = unsubscribe;
}
