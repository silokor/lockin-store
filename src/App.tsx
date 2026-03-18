import { useState, useEffect, useRef } from 'react';
import { Global } from '@emotion/react';
import { globalStyles } from './styles/global';
import { Intro } from './components/Intro';
import { Manifesto } from './components/Manifesto';
import { ProductShowcase } from './components/ProductShowcase';
import { Footer } from './components/Footer';
import { Receipt } from './components/Receipt';
import { products } from './data/products';
import type { Product } from './data/products';

const App = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            if (productId && !viewedProducts.has(productId)) {
              const product = products.find(p => p.id === productId);
              if (product) {
                setViewedProducts(prev => new Set([...prev, productId]));
                setCartItems(prev => [...prev, product]);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [viewedProducts]);

  const removeFromCart = (index: number) => {
    const item = cartItems[index];
    setCartItems(prev => prev.filter((_, i) => i !== index));
    setViewedProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(item.id);
      return newSet;
    });
  };

  return (
    <>
      <Global styles={globalStyles} />
      <Intro />
      <Manifesto />
      {products.map((product, index) => (
        <ProductShowcase
          key={product.id}
          ref={(el) => { productRefs.current[index] = el; }}
          product={product}
          index={index}
        />
      ))}
      <Footer />
      <Receipt items={cartItems} onRemove={removeFromCart} />
    </>
  );
};

export default App;
