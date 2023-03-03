import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import  "../session.js";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "./form.css";
import { setSession } from "../session.js";
import { SERVER_LINK } from "../../../config.js";
import { E } from "../utility.js";
 

export const LoginForm = () => {
  
  const [user, setUser] = useState({
    username: "",
    pass: ""
  });
  const { username, pass } = user;

  //Methods
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { 
    e.preventDefault();
    //do validation
    if(user.pass == "") {
      showModalInfo(true); setModalMsg('Please specify a password.'); setModalStaus('error');hideModalInfo(3500)
    }
    else if(user.username.replaceAll(/ /g, "") == "") {
      showModalInfo(true); setModalMsg('Please specify a username'); setModalStaus('error');hideModalInfo(3500)
    }
    else {
      //valid
      showModalInfo(true); setModalMsg('Signing in'); setModalStaus('')
      logUser(user.username, user.pass)
      .then((res) => { console.log(res.status)
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            setSession(res.id)
            //go to fingerprint
            setTimeout(() => {
              if(res.verify == 'true') {
                if(res.print){
                    //go to dashboard if print is registered
                    window.location.href = "/wallet"
                }
                else {
                    window.location.href = "/fingerprint"
                }
              }
              else {
                //go to verification page
                window.location.href = "/verify"
              }
            }, 200)
          }
          else {
              setModalMsg(res.msg); setModalStaus('error')
          }
          hideModalInfo(3500)
      })
      .catch((err) => { console.log(err)
        setModalMsg('Network error'); setModalStaus('error');hideModalInfo(3500)  
      })
    }
    
  };

  const logUser = (username, pass) => {
        //construct browser fingerprint
        const data = {
           username: username, pass:pass, b:getFingerPrint()
        }
        return fetch( SERVER_LINK + `/login`, {
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
      <p>Sign in and access your mobile wallet easily.</p>

      <form onSubmit={handleSubmit} className="form">
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
        </div>
          <input type="submit"  style={{marginBottom:'20px'}} onSubmit={handleSubmit} value="Sign in" className="btn-primary" />
          <Link to='/'>
            Create account
          </Link>
      </form>
      <ModalInfo />
    </div>
  );
};
