import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const productIds = [1, 2, 3];

    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          productIds.map(async (id) => {
            const productResponse = await api.get(`/products/${id}`);
            const imageResponse = await api.get(`/products/${id}/images`);
            return {
              ...productResponse.data,
              image: imageResponse.data[0]?.image || null
            };
          }),
        );
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-background text-dark"
    >
      <div>
        <header className="mb-16 px-4 text-center">
          <h1 className="mb-4 pt-4 text-4xl font-bold">
            Celebre o Dia da Mulher com Flores
          </h1>
        </header>

        <section className="mb-16 px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Destaques do Dia da Mulher
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showImage={true}
                showName={true}
                showDescription={false}
                showPrice={true}
                showButton={true}
              />
            ))}
          </div>
        </section>

        <section className="mb-16 px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Veja Mais Produtos
          </h2>
          <div className="text-center">
            <a
              href="/catalogo"
              className="bg-dark text-background hover:bg-accent inline-block rounded-full px-6 py-3 text-lg font-bold shadow-lg transition-colors duration-300"
            >
              Ver Catálogo
            </a>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default HomePage;