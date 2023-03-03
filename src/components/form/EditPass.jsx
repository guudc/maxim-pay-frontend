import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../infomodal";
import "./form.css";
import { getSession } from "../session";
import { E } from "../utility";
//import '../check'

export const EditPass = () => {
  const nameRef = useRef();

  const [user, setUser] = useState({
    old: "",
    pass: "",
  });
  const { old, pass } = user;

  //Methods
  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = (e) => { 
    e.preventDefault();
    //do validation
    const nm = /\d/; // regular expression to check for numbers
    const up = /[A-Z]/; // regular expression to check for uppercase letters
    const sp = /[^a-zA-Z0-9]/; // regular expression to check for special characters
    
    if(user.pass == "" || user.pass.length < 8 || !(nm.test(user.pass) && sp.test(user.pass) && up.test(user.pass))) {
        showModalInfo(true); setModalMsg('Please write a strong password'); setModalStaus('error');hideModalInfo(3500)
    }
    else if (user.old == "") {
      showModalInfo(true); setModalMsg('Please write old password'); setModalStaus('error');hideModalInfo(3500)
    }
    else {
      //valid
      showModalInfo(true); setModalMsg('Changing Password'); setModalStaus('')
      editUser()
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

  const editUser = () => {
        const data = {
          old: user.old, 'new': user.pass,
          b: getSession()
        }
        return fetch(`http://localhost:1000/changepass`, {
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
      <h1 style={{textAlign:'center'}}>Edit your profile</h1>
   
      <form onSubmit={handleSubmit} className="form">
        <div className="form_group">
          <label htmlFor="pass">Old Password</label>
          <input
            ref={nameRef}
            type="password"
            name="old"
            value={old}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <div className="form_group">
          <label htmlFor="email">New Password</label>
          <div className="left">
            <input
              type="password"
              name="pass"
              value={pass}
              onChange={handleChange}
              id='thisPass'
              placeholder=""
            />
          <span onClick={viewPassword} id='thisPassEye' className="fas fa-eye-slash" style={{cursor:'pointer', marginLeft:'10px'}}></span>
          </div>
        </div>
        
          <input type="submit"  style={{marginBottom:'20px'}} onSubmit={handleSubmit} value="Save" className="btn-primary" />
        </form>
        <Link to='/FingerPrint'>Change Fingerprint</Link>
      <ModalInfo />
    </div>
  );
};
