import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "./form.css";
import { getSession } from "../session";

export const EditForm = () => {
  const nameRef = useRef();

  const [user, setUser] = useState({
    name: "",
    email: "",
    currency: "naira"
  });
  const { name, email, currency } = user;

  //Methods
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { 
    e.preventDefault();
    //do validation
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const nm = /\d/; // regular expression to check for numbers
    const up = /[A-Z]/; // regular expression to check for uppercase letters
    const sp = /[^a-zA-Z0-9]/; // regular expression to check for special characters
    
    if(user.name.replaceAll(/ /g, "") == "") {
      showModalInfo(true); setModalMsg('Please write a name'); setModalStaus('error');hideModalInfo(3500)
    }
    else if (!user.email.match(validRegex)) {
      showModalInfo(true); setModalMsg('Invalid email'); setModalStaus('error');hideModalInfo(3500)
    }
    else {
      //valid
      showModalInfo(true); setModalMsg('Modifying user'); setModalStaus('')
      editUser(user.email, user.name, user.currency)
      .then((res) => {
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            //go to fingerprint
            setTimeout(() => {
              window.location.href = "/wallet"
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

  const editUser = (email, name, currency) => {
        const data = {
           data: {name: name || null, email: email || null, currency: currency},
           b: getSession()
        }
        console.log(data)
        return fetch(`http://localhost:1000/modifyuser`, {
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
      <h1 style={{textAlign:'center'}}>Edit your profile</h1>
   
      <form onSubmit={handleSubmit} className="form">
        <div className="form_group">
          <label htmlFor="name">Full Name</label>
          <input
            ref={nameRef}
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            placeholder="fullame"
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
        <div className="form_group">
          <label htmlFor="currency">Currency</label>
          <select
            name="currency"
            onChange={handleChange}
          >
            <option value='naira'>Naira</option>
          </select>
        </div>
          <input type="submit"  style={{marginBottom:'20px'}} onSubmit={handleSubmit} value="Save" className="btn-primary" />
        </form>
        <Link to='/changepass'>Change Password</Link>
        <Link to='/FingerPrint'>Change Fingerprint</Link>
      <ModalInfo />
    </div>
  );
};
