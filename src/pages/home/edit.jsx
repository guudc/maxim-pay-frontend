import React from "react";
import { _init_ } from "../../components/check";
import { EditForm } from "../../components/form/EditForm";
import "./home.css";

export const Edit = () => {
  return (
    <section>
      <div className="container home-container">
        <EditForm />
        {_init_()}
      </div>
    </section>
  );
};
