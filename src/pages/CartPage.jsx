import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pen, Trash2 } from "lucide-react";
import {
    getCart,
    removeFromCart,
    updateCartItemText,
    updateCartItemQuantity,
    clearCart
} from "../services/cart";
import api from "../services/api";
import { Link } from "react-router-dom";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [editingItemId, setEditingItemId] = useState(null);
    const [cardText, setCardText] = useState("");
    const [productImages, setProductImages] = useState({});

    useEffect(() => {
        const loadCartData = async () => {
            const items = getCart();
            setCartItems(items);

            try {
                const imagesResponse = await Promise.all(
                    items.map(item =>
                        api.get(`/products/${item.id}/images`)
                            .then(res => ({ id: item.id, data: res.data }))
                    )
                );

                const imagesMap = {};
                imagesResponse.forEach(response => {
                    imagesMap[response.id] = response.data[0]?.image
                        ? `${api.defaults.baseURL}${response.data[0].image}`
                        : '/placeholder.jpg';
                });

                setProductImages(imagesMap);
            } catch (error) {
                console.error("Erro ao carregar imagens:", error);
                const fallbackImages = {};
                items.forEach(item => {
                    fallbackImages[item.id] = '/placeholder.jpg';
                });
                setProductImages(fallbackImages);
            }
        };

        loadCartData();
    }, []);

    const handleRemoveItem = (cartItemId) => {
        setCartItems(removeFromCart(cartItemId));
    };

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(updateCartItemQuantity(cartItemId, newQuantity));
    };

    const handleSaveCardText = () => {
        if (!editingItemId) return;
        const updatedItems = updateCartItemText(editingItemId, cardText);
        setCartItems(updatedItems);
        setEditingItemId(null);
        setCardText("");
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-muted min-h-screen py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-foreground mb-10">
                    Seu Carrinho
                </h1>

                {cartItems.length === 0 ? (
                    <p className="text-center text-muted-foreground text-lg">
                        Seu carrinho está vazio.
                    </p>
                ) : (
                    <>
                        <div className="space-y-6">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.cartItemId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 items-center"
                                    >
                                        {/* Imagem */}
                                        <div className="flex-shrink-0">
                                            <img
                                                src={productImages[item.id] || '/placeholder.jpg'}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-xl shadow-sm"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                        </div>

                                        {/* Conteúdo e botões */}
                                        <div className="flex flex-grow items-center">
                                            {/* Conteúdo (nome, preço, texto) */}
                                            <div className="flex flex-col justify-center">
                                                <h3 className="font-medium text-sm">{item.name}</h3>
                                                <p className="text-gray-600 text-sm">R$ {item.price}</p>
                                                {!item.isCard && (
                                                    <p className="text-xs text-gray-500">Quantidade: {item.quantity}</p>
                                                )}
                                                {item.isCard && item.text && (
                                                    <p className="text-xs text-gray-500 mt-1">Mensagem: "{item.text}"</p>
                                                )}
                                            </div>


                                            {/* Botões à direita */}
                                            <div className="ml-auto flex gap-2">
                                                {item.isCard && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingItemId(item.cartItemId);
                                                            setCardText(item.text || "");
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700 self-start mr-4 "
                                                        aria-label="Editar mensagem"
                                                    >
                                                        <Pen size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveItem(item.cartItemId)}
                                                    className="text-red-500 hover:text-red-700 self-start"
                                                    aria-label="Remover item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>



                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <p className="text-xl font-semibold text-foreground">
                                Total: R$ {totalPrice.toFixed(2)}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { clearCart(), setCartItems([]) }}
                                    className="px-4 py-2 border border-border text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    Limpar Carrinho
                                </button>
                                <Link to={"/checkout"}

                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                >
                                    Finalizar Compra
                                </Link>
                            </div>
                        </div>
                    </>
                )}

                {editingItemId && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-card rounded-2xl p-6 w-full max-w-md shadow-lg border border-border">
                            <h3 className="text-lg font-semibold mb-4">Editar Mensagem</h3>
                            <textarea
                                value={cardText}
                                onChange={(e) => setCardText(e.target.value)}
                                className="w-full border border-border rounded-lg p-3 mb-4 text-sm"
                                rows={4}
                                placeholder="Digite sua mensagem..."
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setEditingItemId(null)}
                                    className="px-4 py-2 border text-sm rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveCardText}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
