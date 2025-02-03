import React, { useEffect, useState } from "react";
import api from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const Catalog = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Obter todos os produtos
    api.get("/products")
      .then(async (response) => {
        const productsData = response.data;

        // Buscar a primeira imagem para cada produto
        const productsWithImages = await Promise.all(productsData.map(async (product) => {
          try {
            const imageResponse = await api.get(`/products/${product.id}/images`);
            const firstImage = imageResponse.data.length > 0 ? imageResponse.data[0].image : null;
            return { ...product, image: firstImage };
          } catch (error) {
            console.error(`Erro ao buscar imagem para o produto ${product.id}:`, error);
            return { ...product, image: null };
          }
        }));

        setProducts(productsWithImages);
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
              <div className="ratio ratio-1x1">
                {/* Exibir a primeira imagem do produto */}
                <img
                  src={product.image ? `${api.defaults.baseURL}${product.image}` : "/placeholder.jpg"}
                  className="card-img-top img-fluid object-fit-cover"
                  alt={product.name}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.name || "Carregando..."}</h5>
                <p className="card-text">
                  {product.description || "Sem descrição disponível."}
                </p>
              </div>
              <div className="card-footer">
                <a href={`/catalogo/${product.id}`} className="btn btn-primary w-100">
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
