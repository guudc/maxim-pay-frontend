import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import  "../session.js";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "./form.css";
import { SERVER_LINK } from "../../../config.js";
import { getUserData, _init_ } from "../../components/check";
import { E } from "../utility.js";
let hasGot = false;

export const VerifyForm = () => {
let userData;

 const [user, setCode] = useState({
    code: ""
 });
 const { code } = user;

 const handleChange = (e) =>
    setCode({ ...user, [e.target.name]: e.target.value });

const handleSubmit = (e) => { 
        e.preventDefault();
        //do validation
        if(user.code == "") {
          showModalInfo(true); setModalMsg('Code not set'); setModalStaus('error');hideModalInfo(3500)
        }
        else {
          //valid
          showModalInfo(true); setModalMsg('Verifing'); setModalStaus('')
          console.log(userData)
          verify(userData.username, user.code)
          .then((res) => {  
              if(res.status === true) {
                setModalMsg('Successfull'); setModalStaus('good')
                //go to login
                window.location.href = "/login"
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

  const getVerify = (username) => {
        //construct browser fingerprint
        const data = {
           username: username
        }
        return fetch( SERVER_LINK + `/getverify`, {
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
  const verify = (username, code) => {
    //construct browser fingerprint
    const data = {
       username: username,
       code:code
    }
    console.log(data)
    return fetch( SERVER_LINK + `/verify`, {
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

  const _init = () => {
    const tmr = setInterval(() => {
        if(getUserData() != null) {
            //stop timer
            clearInterval(tmr)
            userData = getUserData();  console.log(userData)
            if(userData.verify != 'true') { 
                if(!hasGot) {
                    //else run the send verification code
                    hasGot = true
                    getVerify(userData.username)
                    .then(res => {  
                        if(res.status === true) {
                            E('verifyAct').style.display = 'none'
                            E('verifyForm').style.display = 'block'
                        }
                        else {
                            setModalMsg(res.msg); setModalStaus('error'); hideModalInfo(3000)
                        }
                    })
                    .catch(err => {
                        setTimeout(() => {_init()}, 1000)
                    })
                }
            }
            else {
                //has been verified, go to login
                window.location.href = '/login'
            }
        }
    }, 1000)
  } 
 
  _init()
  return (
    <div className="form__container">
      <h1 style={{textAlign:'center'}}>Welcome to MaximPay</h1>
      
      <div id='verifyAct' className="center topx">
        <p style={{marginBottom:'20px'}}>Verifying your account</p>
        <span className="fas fa-spinner fa-spin fa-3x"></span>
      </div>

      <form id='verifyForm' onSubmit={handleSubmit} className="form" style={{display:'none'}}>
        <p style={{marginBottom:'20px'}}>A code has been sent to your email</p>
        <div className="form_group">
          <label htmlFor="username">Verification Code</label>
          <input
            type="text"
            name="code"
            value={code}
            onChange={handleChange}
          />
        </div>
          <input type="submit" onSubmit={handleSubmit} style={{marginBottom:'20px'}}  value="Verify"  className="btn-primary" />
      </form>
      <ModalInfo />
      {_init_()}
    </div>
  );
};
