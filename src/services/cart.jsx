// Funções para gerenciar o carrinho de compras usando localStorage

import api from "./api";

// Obtém o carrinho atual do localStorage
export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

// Salva o carrinho atualizado no localStorage
export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = async (product) => {
    const cart = getCart(); // Recupera o carrinho do localStorage ou de onde for necessário

    try {
        // Verifica as tags do produto na API
        const response = await api.get(`/products/${product.id}/tags`);
        const productTags = response.data;

        // Verifica se o produto tem a tag "cartão"
        const hasCartaoTag = productTags.includes('cartão');

        if (hasCartaoTag) {
            // Se tiver a tag "cartão", adiciona o produto ao carrinho com quantity = 1
            cart.push({ ...product, quantity: 1, tagCartao: true, text: "" });
        } else {
            // Se o produto não tiver a tag "cartão", busca no carrinho se o produto já existe
            const existingProduct = cart.find(item => item.id === product.id && !item.tagCartao);

            if (existingProduct) {
                // Se o produto já estiver no carrinho, apenas incrementa a quantidade
                existingProduct.quantity += 1;
            } else {
                // Caso o produto não exista no carrinho, adiciona ele com quantity = 1
                cart.push({ ...product, quantity: 1 });
            }
        }

        // Salva o carrinho atualizado
        saveCart(cart);

    } catch (error) {
        console.error('Erro ao verificar as tags do produto:', error);
    }
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
