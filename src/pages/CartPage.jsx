import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart, updateCartQuantity, removeFromCart, clearCart } from '../services/cart'

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
        // Lógica de finalização do pedido (integração com API ou redirecionamento)
        alert("Pedido finalizado com sucesso!");
        clearCart();
        navigate("/");
    };

    if (cartItems.length === 0) {
        return <p className="text-center mt-5 fs-4">Seu carrinho está vazio.</p>;
    }

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Carrinho de Compras</h1>

            <div className="list-group mb-4">
                {cartItems.map((item) => (
                    <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="mb-1">{item.name}</h5>
                            <p className="mb-1 text-muted">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <input
                                type="number"
                                className="form-control me-2"
                                style={{ width: "80px" }}
                                value={item.quantity}
                                min="1"
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                            />
                            <button className="btn btn-danger" onClick={() => handleRemoveItem(item.id)}>Remover</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center">
                <h4>Total: <span className="text-success">R$ {totalPrice.toFixed(2)}</span></h4>
                <div>
                    <button className="btn btn-secondary me-3" onClick={handleClearCart}>Limpar Carrinho</button>
                    <button className="btn btn-primary" onClick={handleCheckout}>Finalizar Pedido</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
