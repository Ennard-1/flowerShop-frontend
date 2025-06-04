import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
};

const pageTransition = {
  duration: 0.4,
  ease: "easeInOut",
};
const CatalogPage = () => {
  // Estado para armazenar os produtos
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  // Função para buscar os produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/regular-products");
        const productsData = response.data;

        // Buscar a primeira imagem para cada produto
        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            try {
              const imageResponse = await api.get(
                `/products/${product.id}/images`,
              );
              const firstImage =
                imageResponse.data.length > 0
                  ? imageResponse.data[0].image
                  : null;
              return { ...product, image: firstImage };
            } catch (error) {
              console.error(
                `Erro ao buscar imagem para o produto ${product.id}:`,
                error,
              );
              return { ...product, image: null };
            }
          }),
        );

        setProducts(productsWithImages);
        console.log(productsWithImages);
        setFilteredProducts(productsWithImages);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filtra os produtos conforme a busca do usuário
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, products]);

  return (
    <motion.div
      className="container mx-auto p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className="bg-background h-full min-h-screen w-full">
        {/* Cabeçalho da página com título */}
        <header className="mb-8 px-4 text-center">
          <h1 className="text-dark mb-4 pt-4 text-4xl font-bold">
            Nosso Catálogo
          </h1>
          {/* Barra de pesquisa */}
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md rounded-md border border-gray-300 p-2 text-lg focus:outline-none"
          />
        </header>

        {/* Seção de produtos */}
        <section className="mb-16 px-4">
          <h2 className="text-dark mb-8 text-center text-3xl font-bold">
            Todos os Produtos
          </h2>
          <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-4 sm:gap-4 sm:p-4">
            {loading ? (
              // Exibe indicador de carregamento enquanto busca os produtos
              <p className="text-secondary-text text-center text-lg">
                Carregando produtos...
              </p>
            ) : error ? (
              // Exibe mensagem de erro caso haja falha na requisição
              <p className="text-alert text-center text-lg">{error}</p>
            ) : filteredProducts.length > 0 ? (
              // Renderiza a lista de produtos caso existam
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id} // Define uma chave única para cada item
                  product={product} // Passa os dados do produto como props
                  showImage={true} // Exibe a imagem do produto
                  showName={true} // Exibe o nome do produto
                  showDescription={true} // Exibe a descrição do produto
                  showPrice={true} // Exibe o preço do produto
                  showButton={true} // Exibe o botão de compra
                />
              ))
            ) : (
              // Exibe mensagem caso não haja produtos disponíveis
              <p className="text-secondary-text text-center text-lg">
                Nenhum produto encontrado.
              </p>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default CatalogPage;
