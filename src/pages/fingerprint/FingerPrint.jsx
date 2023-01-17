import React from "react";
import "./fingerprint.css";
import FingerPrintIcon from "../../assets/svg/fingerprint.svg";
import finger1 from "../../assets/img/Fingerprints/00.png";
import finger2 from "../../assets/img/Fingerprints/01.png";
import finger3 from "../../assets/img/Fingerprints/02.png";
import finger4 from "../../assets/img/Fingerprints/03.png";
import finger5 from "../../assets/img/Fingerprints/04.png";
import finger6 from "../../assets/img/Fingerprints/05.png";
import finger7 from "../../assets/img/Fingerprints/06.png";
import finger8 from "../../assets/img/Fingerprints/07.png";
import finger9 from "../../assets/img/Fingerprints/08.png";
import finger10 from "../../assets/img/Fingerprints/09.png";
import { E, G } from "../../components/utility";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../../components/infomodal";

let id = ""

const regFingerPrint = (_id) => {
    //generate random string
    const _print = generateRandomString(_id * 15)
    showModalInfo(true); setModalMsg('Registering fingerprint'); setModalStaus('')
    regUserPrint(id, _print)
      .then((res) => {
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            //go to fingerprint
            setTimeout(() => {
              window.location.href = "/"
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
const showFingerPrint = () => {
  E('fingerprint').style.display = ""
}
const hideFingerPrint = () => {
  E('fingerprint').style.display = "none"
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
const regUserPrint = (email, _print) => {
        const data = {
           print: _print, email: email
        }
        return fetch(`https://maxim-i7f1.onrender.com/reguserprint`, {
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
export const FingerPrint = () => {
//get the id of this page
id = G('id')
 
  return (
    <>
    <section>
      <div className="container fingerprint-container">
        <div className="content">
          <div className="fingerprint-box">
            <img src={FingerPrintIcon} alt="icon" className="icon" />
          </div>
          <h2>Add Fingerprint</h2>
          <p style={{textAlign:'center'}}>
            Registering fingerprint would enable maxim pay link your biometric to your new payment wallet address.
          </p>
          <div onClick={showFingerPrint} className="fingerprint-btn">
            Register Fingerprint
          </div>
        </div>
      </div>
    </section>
    <section id='fingerprint' style={{display:'none'}}>
        <div className="overlay">
            <div className="modal">
              <div className="modal_error">Fingerprint scanner not detected</div>
              <div className="modal_msg">Select from these simulated fingerprints</div>
              <div className="fingerprintselct">
                  <img onClick={() => regFingerPrint(1)} src={finger1} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(2)} src={finger2} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(3)} src={finger3} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(4)} src={finger4} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(5)} src={finger5} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(6)} src={finger6} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(7)} src={finger7} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(8)} src={finger8} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(9)} src={finger9} className='fingerprint_img' />
                  <img onClick={() => regFingerPrint(10)} src={finger10} className='fingerprint_img' />
             </div>
              <div  onClick={hideFingerPrint} className="fingerprint-btn-grey">
                  Cancel
              </div>
            </div>
        </div>
    </section>
    <ModalInfo/>
    </>
  );
};
