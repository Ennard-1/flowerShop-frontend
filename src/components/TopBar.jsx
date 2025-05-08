import { Link } from "react-router-dom";
import { ShoppingCart, Phone, MapPin } from "lucide-react";

function TopBar() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Nome da loja */}
        <Link to="/" className="text-2xl font-bold text-dark">
          Minha Loja
        </Link>

        {/* Ícones */}
        <nav className="flex space-x-6">
          <Link to="/carrinho" aria-label="Carrinho">
            <ShoppingCart className="h-6 w-6 text-dark hover:text-primary transition-colors" />
          </Link>

          <Link to="/contato" aria-label="Contato">
            <Phone className="h-6 w-6 text-dark hover:text-primary transition-colors" />
          </Link>

          <Link to="/localizacao" aria-label="Localização">
            <MapPin className="h-6 w-6 text-dark hover:text-primary transition-colors" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default TopBar;
