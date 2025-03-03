import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import api from "../services/api";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const ProductCard = ({
  product,
  showImage = true,
  showName = true,
  showDescription = true,
  showPrice = true,
  showButton = true,
  buttonVariant = "primary",
  buttonSize = "medium",
}) => (
  <div className="bg-card-background transform rounded-lg p-6 shadow-lg transition hover:scale-105 hover:shadow-xl">
    {/* Imagem */}
    {showImage && (
      <div className="relative mb-4 w-full">
        <img
          src={product.image ? `${api.defaults.baseURL}${product.image}` : "/placeholder.jpg"}
          alt={product.name || "Imagem do produto"}
          className="mx-auto aspect-[3/4] h-auto w-full rounded-md object-cover"
        />
      </div>
    )}

    {/* Nome e Preço */}
    <div className="mb-4 grid gap-2">
      {showName && (
        <h2 className="text-dark text-xl font-bold">{product.name}</h2>
      )}
      {showPrice && (
        <p className="text-dark text-lg font-bold">
          {formatPrice(product.price)}
        </p>
      )}
    </div>

    {/* Descrição do produto */}
    {showDescription && (
      <p className="text-secondary-text mb-4">{product.description}</p>
    )}

    {/* Botão Comprar */}
    {showButton && (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        className="mt-4 w-full"
        href={`/catalogo/${product.id}`} // Redireciona para a página do produto
      >
        Comprar
      </Button>
    )}
  </div>
);

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

    images: PropTypes.array,
  }).isRequired,
  showImage: PropTypes.bool,
  showName: PropTypes.bool,
  showDescription: PropTypes.bool,
  showPrice: PropTypes.bool,
  showButton: PropTypes.bool,
  buttonVariant: PropTypes.oneOf(["primary", "secondary", "outline"]),
  buttonSize: PropTypes.oneOf(["small", "medium", "large"]),
};

export default ProductCard;
