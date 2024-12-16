import React, { useEffect, useState } from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Catalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Obter todos os produtos
    api.get("/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Catálogo de Flores</h1>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-md-4" key={product.id}>
            <div className="card h-100">
              <div className="ratio ratio-4x3">
                {/* Imagem do produto */}
                <img
                  src={`/products/images/${product.ProductImages?.[0]?.image}`}
                  className="card-img-top"
                  alt={product.name}
                />
              </div>
              <div className="card-body">
                {product.name ? (
                  <h5 className="card-title">{product.name}</h5>
                ) : (
                  <h5 className="card-title text-muted">Carregando...</h5>
                )}
                <p className="card-text">
                  {product.description ? product.description : "Sem descrição disponível."}
                </p>
              </div>
              <div className="card-footer">
                <a href={`/products/${product.slug}`} className="btn btn-primary w-100">
                  Ver Detalhes
                </a>
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default Catalog;
