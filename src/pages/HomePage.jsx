import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const HomePage = () => {
  const location = useLocation();
  const [featuredProducts, setFeaturedProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Busca todos os produtos regulares (ou pelo menos os primeiros da lista)
      const response = await api.get('/regular-products');

      // Pega os 3 primeiros produtos da lista retornada
      const products = response.data.slice(0, 3);

      // Para cada produto, buscar a imagem (se for necessário)
      const productsWithImages = await Promise.all(
        products.map(async (product) => {
          const imageResponse = await api.get(`/products/${product.id}/images`);
          return {
            ...product,
            image: imageResponse.data[0]?.image || null,
          };
        })
      );

      setFeaturedProducts(productsWithImages);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  fetchProducts();
}, []);


  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-[#fff8f2] text-[#2d2d2d]"
    >
      {/* Hero */}
 <section
  className="relative w-full min-h-[60vh] flex items-center justify-center bg-center bg-cover"
  style={{ backgroundImage: "url('/streetPicture.jpg')" }} // coloque o caminho certo aqui
>
  {/* Overlay escurecido */}
  <div className="absolute inset-0 bg-black/50"></div>

  {/* Conteúdo centralizado */}
  <div className="relative z-10 text-center px-4">
    <p className="text-white text-2xl md:text-3xl font-light mb-6 drop-shadow-md">
      Contribuindo com a sua linda história de amor
    </p>
    <a
      href="/catalogo"
      className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition"
    >
      Ver Catálogo
    </a>
  </div>
</section>



      {/* Produtos em destaque */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Mais Vendidos</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


   
    </motion.div>
  );
};

export default HomePage;
