import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';

const App = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
