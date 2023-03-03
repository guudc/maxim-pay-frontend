import React, { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/all.css"

import { Checkout } from "./pages/checkout/Checkout";
import { FingerPrint } from "./pages/fingerprint/FingerPrint";
import { Home } from "./pages/home/Home";
import { Login } from "./pages/home/login";
import { Dashboard } from "./pages/home/dashboard";
import { Edit } from "./pages/home/edit";
import { Pass } from "./pages/home/pass";
import { Transfer } from "./pages/home/Transfer";
import { Verify } from "./pages/home/verify";
import { Tx } from "./pages/home/tx";

export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement('script');
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}
export const App = () => {
  return (
    <>
    <Fragment>
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/checkout" index element={<Checkout />} />
        <Route path="/fingerprint" index element={<FingerPrint />} />
        <Route path="/login" index element={<Login />} />
        <Route path="/wallet" index element={<Dashboard />} />
        <Route path="/edit" index element={<Edit />} />
        <Route path="/changepass" index element={<Pass />} />
        <Route path="/Transfer" index element={<Transfer />} />
        <Route path="/Verify" index element={<Verify />} />
        <Route path="/tx" index element={<Tx />} />
      </Routes>
    </Fragment>
    {AddLibrary('https://js.paystack.co/v1/inline.js')}
  </> 
  );
};
