import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

const ProductDetail = () => {
  const location = useLocation();
  const state = location.state;
  console.log(state);
  return (
    <div>
      <NavBar />
      <SearchBar searchParams={state.searchParams} />
    </div>
  );
};

export default ProductDetail;
