import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pen, Trash2 } from "lucide-react";
import { getCart, updateCartQuantity, removeFromCart, clearCart, saveCart } from "../services/cart";
import api from "../services/api";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cardText, setCardText] = useState("");

    useEffect(() => {
        const loadCartWithTags = async () => {
            const items = getCart();

            const updatedItems = await Promise.all(
                items.map(async (item) => {
                    try {
                        const res = await fetch(`/api/products/${item.id}/tags`);
                        const tags = await res.json();
                        const hasCartao = tags.some(tag => tag.name.toLowerCase() === "cartão");
                        return { ...item, tagCartao: hasCartao };
                    } catch (error) {
                        console.error("Erro ao buscar tags:", error);
                        return item;
                    }
                })
            );
            const itensWithImages = await Promise.all(
                items.map(async (item) => {
                  try {
                    const imageResponse = await api.get(
                      `/products/${item.id}/images`,
                    );
                    const firstImage =
                      imageResponse.data.length > 0
                        ? imageResponse.data[0].image
                        : null;
                    return { ...item, image: firstImage };
                  } catch (error) {
                    console.error(
                      `Erro ao buscar imagem para o produto ${item.id}:`,
                      error,
                    );
                    return { ...item, image: null };
                  }
                }),
              );
            setCartItems(itensWithImages);
        };

        loadCartWithTags();
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

    const handleOpenDialog = (index) => {
        setSelectedItemIndex(index);
        setCardText(cartItems[index].text || "");
        setIsDialogOpen(true);
    };

    const handleSaveText = () => {
        // Verifica se o índice selecionado é válido
        if (selectedItemIndex === null) return;
    
        const updatedItems = [...cartItems];
        
        // Atualiza o texto do produto com base no índice
        updatedItems[selectedItemIndex].text = cardText;
    
        // Salva o carrinho atualizado (presumivelmente em localStorage ou outro armazenamento)
        saveCart(updatedItems);
        
        // Atualiza o estado do carrinho no componente
        setCartItems(updatedItems);
        
        // Fecha o diálogo
        setIsDialogOpen(false);
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
            <div className="container mx-auto max-w-4xl">
                <h1 className="mb-8 text-center text-3xl font-bold text-dark">Carrinho de Compras</h1>
    
                {cartItems.length === 0 ? (
                    <p className="text-center text-muted text-lg">Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            <AnimatePresence>
                                {cartItems.flatMap((item, index) => {
                                    if (item.tagCartao) {
                                        return Array.from({ length: item.quantity }, (_, i) => ({
                                            ...item,
                                            quantity: 1,
                                            key: `${item.id}-${index}-${i}`,
                                            originalIndex: index
                                        }));
                                    }
                                    return [{ ...item, key: `${item.id}-${index}`, originalIndex: index }];
                                }).map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="mb-4 flex items-start justify-between gap-4 rounded-lg bg-white p-4 shadow-md flex-row sm:items-center"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Imagem do Produto */}
                                           
                                                <img 
                                                    src={item.image ? `${api.defaults.baseURL}${item.image}` : "/placeholder.jpg"} 
                                                    alt={item.name} 
                                                    className="h-16 w-16 object-cover rounded-md"
                                                />
                                           
                                            <div>
                                                <h5 className="text-lg font-semibold text-dark">{item.name}</h5>
                                                <p className="text-muted text-sm">R$ {item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
    
                                        <div className="flex items-center gap-3">
                                            {/* Controle de Quantidade, apenas se não for um cartão */}
                                            {!item.tagCartao && (
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
                                            )}
    
                                            {item.tagCartao && (
                                                <button
                                                    onClick={() => handleOpenDialog(item.originalIndex)}
                                                    className="text-blue-500 hover:text-blue-700 text-lg"
                                                >
                                                   <Pen/>
                                                </button>
                                            )}
    
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
    
            {/* Modal para editar o texto do cartão */}
            <AnimatePresence>
                {isDialogOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsDialogOpen(false)}
                    >
                        <motion.div
                            className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-lg font-bold mb-4">Mensagem do Cartão</h2>
                            <textarea
                                className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-dark text-lg"
                                rows="4"
                                value={cardText}
                                onChange={(e) => setCardText(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsDialogOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveText}
                                    className="px-4 py-2 bg-dark text-white rounded hover:bg-dark/90"
                                >
                                    Salvar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default CartPage;
