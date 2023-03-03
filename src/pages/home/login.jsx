import React from "react";
import { LoginForm } from "../../components/form/LoginForm";
import "./home.css";

export const Login = () => {
  return (
    <section>
      <div className="container home-container">
        <LoginForm />
      </div>
    </section>
  );
};
