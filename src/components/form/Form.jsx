import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "./form.css";

export const Form = () => {
  const nameRef = useRef();

  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const { name, email } = user;

  //Methods
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { 
    e.preventDefault();
    //do validation
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(user.name.replaceAll(/ /g, "") == "") {
      showModalInfo(true); setModalMsg('Please write a name'); setModalStaus('error');hideModalInfo(3500)
    }
    else if (!user.email.match(validRegex)) {
      showModalInfo(true); setModalMsg('Invalid email'); setModalStaus('error');hideModalInfo(3500)
    }
    else {
      //valid
      showModalInfo(true); setModalMsg('Registering new user'); setModalStaus('')
      regUser(user.email, user.name)
      .then((res) => {
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            //go to fingerprint
            setTimeout(() => {
              window.location.href = "/fingerprint?id=" + res.id
            }, 200)
          }
          else {
              setModalMsg(res.msg); setModalStaus('error')
          }
          hideModalInfo(3500)
      })
      .catch((err) => {
        setModalMsg('Network error'); setModalStaus('error');hideModalInfo(3500)  
      })
    }
    
  };

  const regUser = (email, name) => {
        const data = {
           name: name, email: email
        }
        return fetch(`https://maxim-i7f1.onrender.com/newuser`, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(data)
    }).then((response) => response.json()
      .then((data) => {return data}))
  }
  useEffect(() => {
    nameRef.current.focus();
  }, []);

  return (
    <div className="form__container">
      <h1>Welcome to Maxim pay</h1>
      <h3>Easier way to pay</h3>
      <p>Let's set you up quickly so you can start paying easily.</p>

      <form onSubmit={handleSubmit} className="form">
        <div className="form_group">
          <label htmlFor="name">First Name</label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="your first name"
          />
        </div>
        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="youraddress@mail.com"
          />
        </div>
          <input type="submit"  style={{marginBottom:'20px'}} onSubmit={handleSubmit} value="Register" className="btn-primary" />
          <Link to='/checkout'>
            Go  to demo store
          </Link>
          
      </form>
      <ModalInfo />
    </div>
  );
};
