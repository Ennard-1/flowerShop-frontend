import { Link } from "react-router-dom";
import { ShoppingCart, Phone, MapPin, Search } from "lucide-react";


function FloatingButtons() {

  return (

    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center space-y-3 lg:hidden">
      <Link
        to="/catalogo"
        aria-label="Buscar"
        className="bg-white shadow-lg p-3 rounded-full hover:bg-primary/10 transition"
      >
        <Search className="h-5 w-5 text-dark" />
      </Link>
      <Link
        to="/carrinho"
        aria-label="Carrinho"
        className="bg-white shadow-lg p-3 rounded-full hover:bg-primary/10 transition"
      >
        <ShoppingCart className="h-5 w-5 text-dark" />
      </Link>
      <Link
        to="/contato"
        aria-label="Contato"
        className="bg-white shadow-lg p-3 rounded-full hover:bg-primary/10 transition"
      >
        <Phone className="h-5 w-5 text-dark" />
      </Link>
      <Link
        to="/endereco"
        aria-label="Localização"
        className="bg-white shadow-lg p-3 rounded-full hover:bg-primary/10 transition"
      >
        <MapPin className="h-5 w-5 text-dark" />
      </Link>
    </div>

  );
}

export default FloatingButtons;
