import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';
import { Intro } from '../components/Intro';
import { Manifesto } from '../components/Manifesto';
import { ProductShowcase } from '../components/ProductShowcase';
import { Footer } from '../components/Footer';
import { products } from '../data/products';

export const Home = ({ scrollToShop = false }: { scrollToShop?: boolean }) => {
  const location = useLocation();
  const productRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to products section when accessing /shop or #shop
  useEffect(() => {
    if (scrollToShop || location.hash === '#shop') {
      setTimeout(() => {
        const section = document.getElementById('products-section');
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [scrollToShop, location.hash]);

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
          />
        ))}
      </div>
      <Footer />
    </>
  );
};
