import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import CourseDetails from '../pages/courseDetails/CourseDetails';
import Checkout from '../pages/checkout/Checkout';
import Payment from '../pages/payment/Payment';
import OrderSuccess from '../pages/ordersucess/OrderSuccess';
import NotFound from '../pages/notfound/NotFound';
import Navbar from '../components/navbar/Navbar';
import Courses from '../pages/courses/Courses';
import Footer from '../components/footer/Footer';
import About from '../pages/about/About';
import Home from '../pages/Home/Home';
import FloatingButtons from '../components/FloatingButtons/FloatingButtons';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  
  return null;
}

export default function AppRoutes() {
    return (
        <Router>
            <ScrollToTop />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:slug" element={<CourseDetails />} />
                    <Route path="/checkout/:id" element={<Checkout />} />
                    <Route path="/payment/:orderId" element={<Payment />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
            <FloatingButtons />
        </Router>
    )
}