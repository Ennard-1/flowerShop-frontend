import { useEffect, useState } from "react";
import api from "../services/api";
import "swiper/css";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);


  useEffect(() => {
    // IDs dos produtos que você deseja buscar
    const productIds = [1, 2, 3];

    const fetchProducts = async () => {
      try {
        const productsData = await Promise.all(
          productIds.map(async (id) => {
            const productResponse = await api.get(`/products/${id}`);
            const imageResponse = await api.get(`/products/${id}/images`);

            const product = productResponse.data;
            const firstImage =
              imageResponse.data.length > 0
                ? imageResponse.data[0].image
                : null;

            return { ...product, image: firstImage };
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
    >
      <div className="bg-background h-full min-h-screen w-full">
        <header className="mb-16 px-4 text-center">
          <h1 className="text-dark mb-4 pt-4 text-4xl font-bold">
            Celebre o Dia da Mulher com Flores
          </h1>
        </header>

        <section className="mb-16 px-4">
          <h2 className="text-dark mb-8 text-center text-3xl font-bold">
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
          <h2 className="text-primary-text mb-8 text-center text-3xl font-bold">
            Veja Mais Produtos
          </h2>
          <div className="text-center">
            <a
              href="/catalogo"
              className="bg-accent text-card-background hover:bg-primary inline-block rounded-full px-6 py-3 text-lg font-bold shadow-lg transition duration-300"
            >
              Ver Catálogo
            </a>
          </div>
        </section>
      </div></motion.div>
  );
}
