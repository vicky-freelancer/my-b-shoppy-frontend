import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Core storefront */}
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:slug" element={<CategoryDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {/* Legacy collection URLs -> categories */}
            <Route path="/collections" element={<Navigate to="/categories" replace />} />
            <Route
              path="/collections/:slug"
              element={<NavigateToCategory />}
            />

            {/* Content pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Removed sections redirect home */}
            <Route path="/blog" element={<Navigate to="/" replace />} />
            <Route path="/faq" element={<Navigate to="/" replace />} />
            <Route path="/shipping" element={<Navigate to="/" replace />} />
            <Route path="/track-order" element={<Navigate to="/" replace />} />
            <Route path="/returns" element={<Navigate to="/" replace />} />
            <Route
              path="/privacy-policy"
              element={<Navigate to="/" replace />}
            />
            <Route
              path="/terms-and-conditions"
              element={<Navigate to="/" replace />}
            />

            {/* Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </StoreProvider>
    </BrowserRouter>
  );
}

/** Redirects legacy /collections/:slug URLs to /categories/:slug */
function NavigateToCategory(): React.ReactElement {
  const params = useParams();
  return <Navigate to={`/categories/${params.slug || ''}`} replace />;
}
