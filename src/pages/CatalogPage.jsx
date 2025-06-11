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
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/regular-products");
        const productsData = response.data;

        const productsWithImages = await Promise.all(
          productsData.map(async (product) => {
            try {
              const imageResponse = await api.get(`/products/${product.id}/images`);
              const firstImage =
                imageResponse.data.length > 0
                  ? imageResponse.data[0].image
                  : null;
              return { ...product, image: firstImage };
            } catch (error) {
              console.error(`Erro ao buscar imagem para o produto ${product.id}:`, error);
              return { ...product, image: null };
            }
          })
        );

        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);

        // Extrair todas as tags únicas
        const tagsSet = new Set();
        productsWithImages.forEach((product) => {
          product.tags?.forEach((tag) => tagsSet.add(tag.name));
        });
        setAvailableTags([...tagsSet]);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const tagMatch = selectedTag
        ? product.tags?.some((tag) => tag.name === selectedTag)
        : true;

      return nameMatch && tagMatch;
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedTag, products]);

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
        <header className="mb-8 px-4 text-center">
          <h1 className="text-dark mb-4 pt-4 text-4xl font-bold">Nosso Catálogo</h1>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md rounded-md border border-gray-300 p-2 text-lg focus:outline-none"
          />
        </header>

        {/* Filtro por tags */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 px-4">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(prev => (prev === tag ? null : tag))}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                selectedTag === tag
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <section className="mb-16 px-4">
          <h2 className="text-dark mb-8 text-center text-3xl font-bold">
            Todos os Produtos
          </h2>
          <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-4 sm:gap-4 sm:p-4">
            {loading ? (
              <p className="text-secondary-text text-center text-lg">
                Carregando produtos...
              </p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showImage={true}
                  showName={true}
                  showDescription={true}
                  showPrice={true}
                  showButton={true}
                />
              ))
            ) : (
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
