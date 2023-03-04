import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "../session";
import { setSession } from "../session";
import { E } from "../utility";
import "./form.css";
import { SERVER_LINK } from "../../../config.js";

export const Form = () => {
  const nameRef = useRef();

  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    pass: "",
    currency: "naira"
  });
  const { name, email, username, pass, currency } = user;

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
    else if(user.pass == "" || user.pass.length < 8 || !(nm.test(user.pass) && sp.test(user.pass) && up.test(user.pass))) {
      showModalInfo(true); setModalMsg('Please specify a strong password.'); setModalStaus('error');hideModalInfo(3500)
    }
    else if(user.username.replaceAll(/ /g, "") == "") {
      showModalInfo(true); setModalMsg('Please specify a username'); setModalStaus('error');hideModalInfo(3500)
    }
    else if (!user.email.match(validRegex)) {
      showModalInfo(true); setModalMsg('Invalid email'); setModalStaus('error');hideModalInfo(3500)
    }
    else {
      //valid
      showModalInfo(true); setModalMsg('Registering new user'); setModalStaus('')
      regUser(user.email, user.name, user.username, user.pass, user.currency)
      .then((res) => {
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            setSession(getFingerPrint())
            //go to fingerprint
            setTimeout(() => {
              window.location.href = "/verify"
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
  function getFingerPrint(){
    var canvas =  document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    var txt = "i9asdm..#$po(^$W%^W%&*W*09) wr-cz" + new Date(Date()).getTime()
    ctx.textBaseline = "top"
    ctx.font = "19px sans-serif"
    ctx.textBaseline = "alphabetic"
    ctx.rotate = "(.07)"
    ctx.fillStyle = "#f60"
    ctx.fillRect(125,1,62,20)
    ctx.fillStyle = "#069"
    ctx.fillText(txt,2,19)
    ctx.fillStyle = "rgba(102,200,0,0.7)"
    ctx.fillText(txt,4,17)
    ctx.shadowBlur = 9
    ctx.shadowColor = "green"
    ctx.fillRect(-20,10,234,5)
    var res = canvas.toDataURL()
    var hash = 0
    var char = ""
    ctx = null
    canvas = null
    if(res.length == 0){
        return ""
    }
    else{
        for(let i=0;i<res.length;i++){
            char = res.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        hash = hash + "GA"
        return hash.replace(/[^0-9A-Z]/g,"")
    }
    
  }
  const regUser = (email, name, username, pass, currency) => {
        const data = {
           name: name, email: email, username: username, pass:pass, currency: currency
           ,b: getFingerPrint()
        }
        return fetch(SERVER_LINK + `/newuser`, {
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
  const viewPassword = () => {
    const typ = E('thisPassEye').className
    if(typ.indexOf('eye-slash') > -1) {
      //currently hidden
      E('thisPass').type = 'text'
      E('thisPassEye').className = 'fas fa-eye'
    }
    else {
      //currently open
      E('thisPass').type = 'password'
      E('thisPassEye').className = 'fas fa-eye-slash'
    }
   }
   
  return (
    <div className="form__container">
      <h1 style={{textAlign:'center'}}>Welcome to Maxim pay</h1>
      <p>Let's set you up quickly so you can start paying easily.</p>

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
        <div className="form_group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className="form_group">
          <label htmlFor="pass">Password</label>
           <div className="left">
            <input
              type="password"
              name="pass"
              value={pass}
              onChange={handleChange}
              id='thisPass'
            />
          <span onClick={viewPassword} id='thisPassEye' className="fas fa-eye-slash" style={{cursor:'pointer', marginLeft:'10px'}}></span>
          </div>
          <span style={{color:'grey', fontSize:'13px'}}>Password must include uppercase, numbers and special characters</span>
        </div>
          <input type="submit"  style={{marginBottom:'20px'}} onSubmit={handleSubmit} value="Register" className="btn-primary" />
          <Link to='./login'>
            Already have an account
          </Link>
      </form>
      <ModalInfo />
    </div>
  );
};
