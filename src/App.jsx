import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/all.css"

import { Checkout } from "./pages/checkout/Checkout";
import { FingerPrint } from "./pages/fingerprint/FingerPrint";
import { Home } from "./pages/home/Home";

export const App = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/checkout" index element={<Checkout />} />
        <Route path="/fingerprint" index element={<FingerPrint />} />
      </Routes>
    </Fragment>
  );
};
