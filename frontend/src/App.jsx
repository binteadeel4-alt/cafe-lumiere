import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";

import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import MenuManagement from "./admin/MenuManagement";
import Orders from "./admin/Orders";
import Messages from "./admin/Messages";
import AdminReviews from "./admin/AdminReviews";
import AdminRoute from "./admin/AdminRoute";
import AdminNavbar from "./admin/AdminNavbar";
import GalleryManagement from "./admin/GalleryManagement";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";


function App() {

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  const isAdminLogin = location.pathname === "/admin/login";

  const showAdminNavbar = isAdminPage && !isAdminLogin;

  const showPublicLayout = !isAdminPage;


  return (
    <>

      {/* PUBLIC NAVBAR */}

      {showPublicLayout && <Navbar />}


      {/* ADMIN NAVBAR */}

      {showAdminNavbar && <AdminNavbar />}


      {/* ROUTES */}

      <Routes>

        {/* CUSTOMER PAGES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/menu"
          element={<Menu />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* ADMIN LOGIN */}

        <Route
          path="/admin/login"
          element={<Login />}
        />


        {/* PROTECTED ADMIN PAGES */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/admin/menu"
            element={<MenuManagement />}
          />

          <Route
            path="/admin/orders"
            element={<Orders />}
          />

          <Route
            path="/admin/messages"
            element={<Messages />}
          />

          <Route
            path="/admin/reviews"
            element={<AdminReviews />}
          />

          <Route
            path="/admin/gallery"
            element={<GalleryManagement />}
          />

        </Route>


        {/* CUSTOMER ORDER PAGES */}

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/order-success/:orderId"
          element={<OrderSuccess />}
        />

      </Routes>


      {/* PUBLIC FOOTER */}

      {showPublicLayout && <Footer />}

    </>
  );
}


export default App;

