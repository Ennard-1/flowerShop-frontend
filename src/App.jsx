import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion";
import NotFound from './pages/NotFound';
import CartPage from './pages/CartPage';
import TopBar from './components/TopBar';
import OrderSummaryPage from './pages/OrderSummaryPage';
import ContactPage from './pages/ContactPage';
import AdressPage from './pages/AdressPage';
import AdminProductListPage from './pages/AdminProductListPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CatalogPage from './pages/CatalogPage';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import FloatingButtons from './components/FloatingButtons';

function App() {
  const location = useLocation();

  const hideTopBarRoutes = ["/admin", "/admin/editar-produtos"];

  const hideTopBar = hideTopBarRoutes.includes(location.pathname);
  const hideFloatingbuttonsRoutes = ["/admin", "/admin/editar-produtos", "/checkout", "/pedido"]
  const hideFloatingbuttons = hideFloatingbuttonsRoutes.includes(location.pathname);
  return (
    <div>
      {/* <Header /> */}
      <main >
        <AnimatePresence>

          {!hideTopBar && <TopBar />}
          {!hideFloatingbuttons &&  <FloatingButtons />}
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/endereco" element={<AdressPage />} />
            <Route path='/contato' element={<ContactPage />} />
            <Route path='/catalogo' element={<CatalogPage />} />
            <Route path="/catalogo/:id" element={<ProductDetailPage />} />
            <Route path='/carrinho' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/pedido' element={<OrderSummaryPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path='/admin/editar-produtos' element={<AdminProductListPage />} />

          </Routes>
        </AnimatePresence>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;
