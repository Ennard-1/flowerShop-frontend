import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Catalog from './pages/Catalog';
import AdminLogin from './pages/AdminLogin';
import ProductList from './pages/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div>
      <Header />
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/catalogo' element={<Catalog />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path='/admin/editar-produtos' element={<ProductList />} />
          <Route path="/catalogo/:id" element={<ProductDetail />} />
          <Route path='/carrinho' element={<CartPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
