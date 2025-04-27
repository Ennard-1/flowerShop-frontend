import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cart";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Erro ao buscar produto:", error));

    api
      .get(`/products/${id}/images`)
      .then((response) => setImages(response.data.map((img) => img.image)))
      .catch((error) =>
        console.error("Erro ao buscar imagens do produto:", error),
      );
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    alert("Produto adicionado ao carrinho!");
  };

  // Define the first image as the default selected image
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (!product) return <p className="fs-4 mt-5 text-center">Carregando...</p>;

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="container mx-auto max-w-screen-lg">
        <h1 className="text-dark mb-8 text-center text-4xl font-bold">
          {product.name}
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Seletor de Imagens - Imagem Principal + Miniaturas com Blur */}
          <div className="flex flex-col items-center">
            <div className="mb-4 w-full overflow-hidden rounded-lg shadow-lg">
              <img
                src={`${api.defaults.baseURL}${selectedImage}`}
                alt="Imagem Principal"
                className="h-96 w-full rounded-lg object-cover"
              />
            </div>

            {/* Miniaturas de Imagens */}
            <div className="flex space-x-4 overflow-x-auto py-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={`${api.defaults.baseURL}${image}`}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                    style={{
                      filter: selectedImage === image ? "none" : "blur(4px)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes do Produto */}
          <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-dark mb-4 text-2xl font-semibold">Descrição</h2>
            <p className="text-muted mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-dark text-xl font-semibold">Preço:</h3>
              <p className="text-dark text-3xl font-bold">{formatPrice(product.price)}</p>
            </div>

            <button
              className={`btn btn-lg w-full rounded-lg py-3 text-xl ${product.quantity > 0 ? "bg-dark text-background" : "bg-gray-300 text-gray-500"}`}
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
