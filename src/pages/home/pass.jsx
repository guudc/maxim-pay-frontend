import React from "react";
import { EditPass } from "../../../src/components/form/EditPass";
import { _init_ } from "../../components/check";
import "./home.css"; 
export const Pass = () => {
  return (
    <section>
      <div className="container home-container">
        <EditPass />
        {_init_()}
      </div>
    </section>
  );
};
