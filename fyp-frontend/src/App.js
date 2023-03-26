import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/products"
            element={<Products itemsPerPage={12} />}
          />
          <Route
            exact
            path="/product-details/:id"
            element={<ProductDetail />}
          />
          <Route exact path="/contact-form" element={<ContactForm />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
