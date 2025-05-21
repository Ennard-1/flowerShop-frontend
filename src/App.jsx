
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import Home from './pages/Home';
import About from './pages/AdressPage';
import NotFound from './pages/NotFound';
import Catalog from './pages/Catalog';
import AdminLogin from './pages/AdminLogin';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import TopBar from './components/TopBar';
import OrderSummaryPage from './pages/OrderSummaryPage';
import ContactPage from './pages/ContactPage';
import AdressPage from './pages/AdressPage';

function App() {
  const location = useLocation();

  // Defina as rotas onde a TopBar deve ser escondida
  const hideTopBarRoutes = ["/admin/login", "/admin/editar-produtos"];
  const hideTopBar = hideTopBarRoutes.includes(location.pathname);
  return (
    <div>
      {/* <Header /> */}
      <main >
        <AnimatePresence>

          {!hideTopBar && <TopBar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/endereco" element={<AdressPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path='/catalogo' element={<Catalog />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path='/admin/editar-produtos' element={<ProductList />} />
            <Route path="/catalogo/:id" element={<ProductDetail />} />
            <Route path='/carrinho' element={<CartPage />} />
            <Route path='/pedido' element={<OrderSummaryPage />} />
            <Route path='/contato' element={<ContactPage />}/>
          </Routes>
        </AnimatePresence>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
