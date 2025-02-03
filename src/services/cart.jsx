// Funções para gerenciar o carrinho de compras usando localStorage

// Obtém o carrinho atual do localStorage
export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Salva o carrinho atualizado no localStorage
export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Adiciona um produto ao carrinho
export const addToCart = (product) => {
    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
};

// Remove um produto do carrinho
export const removeFromCart = (productId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
};

// Atualiza a quantidade de um produto no carrinho
export const updateCartQuantity = (productId, quantity) => {
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (product) {
        product.quantity = quantity;
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(cart);
        }
    }
};

// Limpa o carrinho inteiro
export const clearCart = () => {
    localStorage.removeItem('cart');
};
