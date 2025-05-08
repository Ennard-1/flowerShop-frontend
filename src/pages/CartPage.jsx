import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { getCart, updateCartQuantity, removeFromCart, clearCart } from "../services/cart";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCartItems(getCart());
    }, []);

    const handleQuantityChange = (productId, quantity) => {
        updateCartQuantity(productId, quantity);
        setCartItems(getCart());
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
        setCartItems(getCart());
    };

    const handleClearCart = () => {
        clearCart();
        setCartItems([]);
    };

    const handleCheckout = () => {
        alert("Pedido finalizado com sucesso!");
        clearCart();
        navigate("/");
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-background min-h-screen px-4 py-10"
        >
            <div className="bg-background min-h-screen px-4 py-10">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="mb-8 text-center text-3xl font-bold text-dark">Carrinho de Compras</h1>

                    {cartItems.length === 0 ? (
                        <p className="text-center text-muted text-lg">Seu carrinho está vazio.</p>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-4 flex items-start justify-between gap-4 rounded-lg bg-white p-4 shadow-md flex-row sm:items-center"
                                        >
                                            <div>
                                                <h5 className="text-lg font-semibold text-dark">{item.name}</h5>
                                                <p className="text-muted text-sm">R$ {item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {/* Controle de Quantidade */}
                                                <div className="flex items-center border rounded-lg overflow-hidden">
                                                    <button
                                                        className="px-3 py-1 text-xl bg-gray-200 hover:bg-gray-300"
                                                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="w-10 text-center text-lg font-medium">{item.quantity}</div>
                                                    <button
                                                        className="px-3 py-1 text-xl bg-gray-200 hover:bg-gray-300"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Botão de Remover */}
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    aria-label="Remover item"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <h3 className="text-2xl font-semibold text-dark">
                                    Total: <span className="text-green-600">R$ {totalPrice.toFixed(2)}</span>
                                </h3>
                                <div className="flex gap-4">
                                    <button
                                        onClick={handleClearCart}
                                        className="rounded border border-gray-400 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Limpar Carrinho
                                    </button>
                                    <button
                                        onClick={handleCheckout}
                                        className="rounded bg-dark px-4 py-2 text-white hover:bg-black"
                                    >
                                        Finalizar Pedido
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
