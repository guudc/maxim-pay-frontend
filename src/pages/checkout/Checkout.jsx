import React, { useState } from 'react';
import './checkout.css';
import "../fingerprint/fingerprint.css";
import finger1 from "../../assets/img/Fingerprints/00.png";
import { E, G } from "../../components/utility";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../../components/infomodal";


const showFingerPrint = () => {
  E('fingerprint').style.display = ""
}
const hideFingerPrint = () => {
  E('fingerprint').style.display = "none"
}
const payWithMaxim = (_print, _amount) => {
  const data = {
     print: _print, amount: _amount
  }
  return fetch(`https://maximpayserver.onrender.com/payment`, {
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
const pay = (_id) => {
  //generate random string
  _id = prompt('Fingerprint number')
  const _print = generateRandomString(_id * 1);
  showModalInfo(true); setModalMsg('Paying with MaximPay'); setModalStaus('')
  payWithMaxim(_print, 500.90)
    .then((res) => {  
        if(res.status === true) {
          setModalMsg('Payment Successfull'); setModalStaus('good')
          window.open("https://mumbai.polygonscan.com/tx/" + res.hash)
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

function generateRandomString(length) {
  let result = '';
  const characters = 'aaaaaaaaaaaaaaaaaaaaaaa';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const Item = (props) => (
  <div className="item-container">
    <div className="item-image">
      <img src={props.img}/>
     </div>
  </div>
);

const Checkoutt = (props) => (
 <div className="checkout">
    <div className="checkout-container">
     <h3 className="heading-3">Product Details</h3>
     <div className="item-details">
        <h3 className="item-name"> {props.name} </h3>
        <h2 className="item-price"> {props.price} </h2>
      </div>
    
      <Button text="Pay with Maxim pay" />
    </div>
 </div>
);

const Input = (props) => (
  <div className="input">
    <label>{props.label}</label>
    <div className="input-field">
      <input type={props.type} name={props.name} />
      <img src={props.imgSrc}/>
    </div>
  </div>
);

const Button = (props) => (
  <button onClick={showFingerPrint} className="checkout-btn" type="button">{props.text}</button>
);



export const Checkout =  () => {
    return (
      <>
      <div className="app-container">
        <div className="row">
          <div className="col">
            <Item  img="http://ecx.images-amazon.com/images/I/61%2BABMMN5zL._SL1500_.jpg" />
          </div>
          <div className="col no-gutters">
            <Checkoutt name="Instax Mini 90 Neo Classic" price="$500.91" />
          </div>
        </div>
       </div>
       <section id='fingerprint' style={{display:'none'}}>
        <div className="overlay">
            <div className="modal">
              <div className="modal_error">Fingerprint scanner not detected</div>
              <div className="modal_msg">Use simulated fingerprints</div>
              <div className="fingerprintselct">
                  <img onClick={() => pay(1)} src={finger1} className='fingerprint_img' />
              </div>
              <div  onClick={hideFingerPrint} className="fingerprint-btn-grey">
                  Cancel
              </div>
            </div>
        </div>
    </section>
    <ModalInfo />
       </>
    )
 
}
