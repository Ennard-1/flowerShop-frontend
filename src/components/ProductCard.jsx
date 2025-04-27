import React from "react";
import PropTypes from "prop-types";
import api from "../services/api";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const ProductCard = ({ product }) => {
  const isOutOfStock = product.quantity === 0; // Verifica se o produto está fora de estoque

  return (
    <a
      href={`/catalogo/${product.id}`}
      className={`relative block w-full overflow-hidden rounded-md transition-transform hover:scale-105 hover:shadow-lg 
        ${isOutOfStock ? "cursor-not-allowed" : "cursor-pointer"}`} 
    >
      {/* Imagem com proporção 4:3 */}
      <div className="relative w-full aspect-[3/4]">
        <img
          src={product.image ? `${api.defaults.baseURL}${product.image}` : "/placeholder.jpg"}
          alt={product.name || "Imagem do produto"}
          className="w-full h-full object-cover"
        />

        {/* Área com blur para nome e preço */}
        <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-md p-2 text-center">
          <h2 className="text-white text-sm font-semibold truncate">{product.name}</h2>
          <p className="text-secondary text-md font-bold">{formatPrice(product.price)}</p>
        </div>

        {/* Sobreposição de Fora de Estoque */}
        {isOutOfStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <span className="text-white text-center text-2xl font-bold">Fora de Estoque</span>
          </div>
        )}
      </div>
    </a>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string,
    quantity: PropTypes.number.isRequired, // Quantidade para verificar o estoque
  }).isRequired,
};

export default ProductCard;
