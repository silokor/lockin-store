import { useRef, useEffect, useState, useCallback } from 'react';
import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';
import { Intro } from '../components/Intro';
import { Manifesto } from '../components/Manifesto';
import { ProductShowcase } from '../components/ProductShowcase';
import { Footer } from '../components/Footer';
import { CartReceipt } from '../components/CartReceipt';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const { addToCart, items } = useCart();
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewedRef = useRef(viewedProducts);
  const itemsRef = useRef(items);

  // refs 동기화
  viewedRef.current = viewedProducts;
  itemsRef.current = items;

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const productId = entry.target.getAttribute('data-product-id');
        if (!productId) return;
        
        const alreadyViewed = viewedRef.current.has(productId);
        const alreadyInCart = itemsRef.current.some(item => item.id === productId);
        
        if (!alreadyViewed && !alreadyInCart) {
          const product = products.find(p => p.id === productId);
          if (product) {
            setViewedProducts(prev => new Set([...prev, productId]));
            addToCart(product, 1);
          }
        }
      }
    });
  }, [addToCart]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.5 });

    productRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <>
      <Global styles={globalStyles} />
      <Intro />
      <Manifesto />
      <div id="products-section">
        {products.map((product, index) => (
          <ProductShowcase
            key={product.id}
            ref={(el) => { productRefs.current[index] = el; }}
            product={product}
            index={index}
            isViewed={viewedProducts.has(product.id)}
          />
        ))}
      </div>
      <Footer />
      <CartReceipt />
    </>
  );
};
