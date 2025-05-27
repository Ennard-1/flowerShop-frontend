import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Phone, MapPin, Search } from "lucide-react";

function TopBar() {
  const shopName = import.meta.env.VITE_SHOP_NAME;
  const location = useLocation();

  // Páginas que devem exibir os botões flutuantes no mobile
  const showFloatingButtons = ["/", "/produtos", "/carrinho"].includes(location.pathname);

  return (
    <>
      <header className="bg-white shadow-md">
        <div className="relative container mx-auto flex items-center justify-between px-4 py-4">
          {/* Nome da loja (centralizado no mobile) */}
          <Link
            to="/"
            className="text-2xl font-bold text-dark mx-auto lg:mx-0 lg:ml-0"
          >
            {shopName}
          </Link>

          {/* Ícones visíveis apenas em telas grandes */}
          <nav className="hidden lg:flex space-x-6 ml-auto items-center">
            <Link to="/catalogo" aria-label="Buscar">
              <Search className="h-6 w-6 text-dark hover:text-primary transition-colors" />
            </Link>
            <Link to="/carrinho" aria-label="Carrinho">
              <ShoppingCart className="h-6 w-6 text-dark hover:text-primary transition-colors" />
            </Link>
            <Link to="/contato" aria-label="Contato">
              <Phone className="h-6 w-6 text-dark hover:text-primary transition-colors" />
            </Link>
            <Link to="/endereco" aria-label="Localização">
              <MapPin className="h-6 w-6 text-dark hover:text-primary transition-colors" />
            </Link>
          </nav>
        </div>
      </header>

    </>
  );
}

export default TopBar;
