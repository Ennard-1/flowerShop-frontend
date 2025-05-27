import api from "./api";

// Gera um ID único para cada item
const generateUniqueId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = async (product) => {
  const cart = getCart();
  const response = await api.get(`/products/${product.id}/tags`);
  const isCard = response.data.includes('cartão');

  if (isCard) {
    // Cartões são sempre itens individuais, mesmo com quantidade > 1
    const quantity = product.quantity || 1;

    const newCards = Array.from({ length: quantity }, () => ({
      ...product,
      cartItemId: generateUniqueId(),
      isCard: true,
      text: "",
      quantity: 1
    }));

    saveCart([...cart, ...newCards]);
    return;
  }

  // Produtos normais: atualiza quantidade se já estiver no carrinho
  const existingItemIndex = cart.findIndex(
    (item) => item.id === product.id && !item.isCard
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += product.quantity || 1;
  } else {
    cart.push({
      ...product,
      cartItemId: generateUniqueId(),
      isCard: false,
      quantity: product.quantity || 1
    });
  }

  saveCart(cart);
};

export const removeFromCart = (cartItemId) => {
  const cart = getCart().filter(item => item.cartItemId !== cartItemId);
  saveCart(cart);
  return cart;
};

export const updateCartItemText = (cartItemId, text) => {
  const cart = getCart().map(item =>
    item.cartItemId === cartItemId ? { ...item, text } : item
  );
  saveCart(cart);
  return cart;
};

export const updateCartItemQuantity = (cartItemId, quantity) => {
  const cart = getCart().map(item =>
    item.cartItemId === cartItemId ? { ...item, quantity } : item
  );
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem('cart');
};