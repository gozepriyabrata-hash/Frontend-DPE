import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages (to be created)
import Landing from './pages/Landing';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import DeliveryAddress from './pages/DeliveryAddress';
import MarketAnalytics from './pages/MarketAnalytics';
import CabEngine from './pages/CabEngine';

// Components (to be created)
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // Or a loader
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-neo-bg text-neo-black font-neo flex flex-col">
            <Navbar />
            <CartDrawer />
            
            <main className="flex-grow">
              <React.Suspense fallback={<div className="min-h-screen bg-neo-bg flex items-center justify-center font-black uppercase text-4xl">LOADING...</div>}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/analytics" element={<MarketAnalytics />} />
                  <Route path="/cab-engine" element={<CabEngine />} />
                  
                  <Route path="/product/:id" element={<ProductDetail />} />

                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />

                  <Route path="/address" element={
                    <ProtectedRoute>
                      <DeliveryAddress />
                    </ProtectedRoute>
                  } />

                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />

                  <Route path="/order/:id" element={
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  } />
                  
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </React.Suspense>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
