import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Products from "./components/Products";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { ThemeProvider, createTheme } from "@mui/material";
import UserProfile from "./components/UserProfile";
import ChangePassword from "./components/ChangePassword";
import AddSellerForm from "./components/AddSellerForm";
import SellerDetails from "./components/SellerDetails";
import AddProductsForm from "./components/AddProductsForm";

const theme = createTheme({
  palette: {
    primary: {
      light: "#a461d3",
      main: "#8e3ac9",
      dark: "#63288c",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
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
            <Route exact path="/register-form" element={<RegisterForm />} />
            <Route exact path="/login-form" element={<LoginForm />} />
            <Route exact path="/user-info" element={<UserProfile />} />
            <Route exact path="/change-password" element={<ChangePassword />} />
            <Route exact path="/register-seller" element={<AddSellerForm />} />
            <Route exact path="/seller-details" element={<SellerDetails />} />
            <Route exact path="/add-products" element={<AddProductsForm />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
