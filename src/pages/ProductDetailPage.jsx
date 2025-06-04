import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cart";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [quantity, setQuantity] = useState()
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => {
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("Erro ao buscar produto:", error);
        }
      });
    api
      .get(`/products/${id}/images`)
      .then((response) => setImages(response.data.map((img) => img.image)))
      .catch((error) =>
        console.error("Erro ao buscar imagens do produto:", error),
      );
  }, [id]);



  const handleAddToCart = () => {
    setQuantity(1);
    setShowQuantityModal(true);
  };

  const confirmAddToCart = () => {
    addToCart({ ...product, quantity });
    setShowQuantityModal(false);
    setShowConfirmationModal(true);
  };

  // Define the first image as the default selected image
  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  if (notFound) return <p className="bg-background min-h-screen p-6 fs-4 mt-5 text-center">Produto não encontrado.</p>;
  if (!product) return <p className="bg-background min-h-screen p-6  fs-4 mt-5 text-center">Carregando...</p>;

  else
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          className="bg-background min-h-screen p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <div className="container mx-auto max-w-6xl px-4">
            <h1 className="text-dark mb-8 text-center text-4xl font-bold">
              {product.name}
            </h1>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">
              {/* Seletor de Imagens */}
              <div className="flex flex-col items-center">
                <div className="mb-4 w-full overflow-hidden rounded-lg shadow-lg aspect-1/1">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImage}
                      src={`${api.defaults.baseURL}${selectedImage}`}
                      alt="Imagem Principal"
                      className=" rounded-lg object-cover  "
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>
                </div>

                {/* Miniaturas */}
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
              <motion.div
                className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-dark mb-4 text-2xl font-semibold">Descrição</h2>
                <p className="text-muted mb-6">{product.description}</p>

                <div className="mb-6">
                  <h3 className="text-dark text-xl font-semibold">Preço:</h3>
                  <p className="text-dark text-3xl font-bold">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <button
                  className={`btn btn-lg w-full rounded-lg py-3 text-xl ${product.quantity > 0
                    ? "bg-dark text-background"
                    : "bg-gray-300 text-gray-500"
                    }`}
                  disabled={product.quantity === 0}
                  onClick={handleAddToCart}
                >
                  {product.quantity > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
        {/* Modal: Confirmação */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-bold mb-6">Produto adicionado ao carrinho!</h2>
              <div className="flex gap-3">
                <Link
                  to={"/catalogo"}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
                >
                  Continuar Comprando
                </Link>
                <Link
                  to={"/carrinho"}
                  className="flex-1 bg-dark text-white py-2 rounded"
                >
                  Ir para o Carrinho
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Escolher Quantidade */}
        {showQuantityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-center">Escolha a quantidade</h2>
              <input
                type="number"
                min={1}
                max={product.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(product.quantity, Math.max(1, +e.target.value)))
                }
                className="w-full text-center text-xl border rounded py-2 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmAddToCart}
                  className="flex-1 bg-dark text-white py-2 rounded"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>


    );
};

export default ProductDetailPage;
