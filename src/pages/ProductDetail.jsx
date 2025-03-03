import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

import { addToCart } from "../services/cart";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        api.get(`/products/${id}`)
            .then((response) => setProduct(response.data))
            .catch((error) => console.error("Erro ao buscar produto:", error));

        api.get(`/products/${id}/images`)
            .then((response) => setImages(response.data.map(img => img.image)))
            .catch((error) => console.error("Erro ao buscar imagens do produto:", error));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        alert("Produto adicionado ao carrinho!");
    };

    if (!product) return <p className="text-center fs-4 mt-5">Carregando...</p>;

    return (
        <div className="container my-5 p-4 bg-light rounded shadow-sm">
            <h1 className="text-center display-4 mb-4 text-primary">{product.name}</h1>

            <div className="row">
                {/* Carrossel de Imagens */}
                {images.length > 0 && (
                    <div className="col-md-6">
                        <div id="productCarousel" className="carousel slide rounded shadow" data-bs-ride="carousel">
                            <div className="carousel-inner rounded">
                                {images.map((image, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                        <img
                                            src={`${api.defaults.baseURL}${image}`}
                                            className="d-block w-100 rounded"
                                            alt={`Imagem ${index + 1}`}
                                            style={{ height: "400px", objectFit: "cover" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Anterior</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Próximo</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Informações do Produto */}
                <div className="col-md-6 d-flex align-items-center">
                    <div className="p-4 bg-white rounded shadow w-100">
                        <h2 className="h4 text-secondary mb-3">Descrição</h2>
                        <p className="text-muted mb-4">{product.description}</p>

                        <h3 className="h5 mb-3">Preço: <span className="text-success fw-bold">R$ {product.price?.toFixed(2)}</span></h3>

                        <h4 className={`mb-3 fw-semibold ${product.quantity > 0 ? "text-success" : "text-danger"}`}>
                            {product.quantity > 0 ? "Em estoque" : "Fora de estoque"}
                        </h4>

                        <button
                            className={`btn btn-lg w-100 ${product.quantity > 0 ? "btn-primary" : "btn-secondary"}`}
                            disabled={product.quantity === 0}
                            onClick={handleAddToCart}
                        >
                            {product.quantity > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 
