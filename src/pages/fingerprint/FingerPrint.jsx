import React from "react";
import "./fingerprint.css";
import FingerPrintIcon from "../../assets/svg/fingerprint.svg";
import finger1 from "../../assets/img/Fingerprints/00.png";
import { E, G } from "../../components/utility";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../../components/infomodal";

let id = ""

const regFingerPrint = (_id) => {
    //generate random string
    const _print = generateRandomString(_id * 15)
    showModalInfo(true); setModalMsg('Registering fingerprint'); setModalStaus('')
    regUserPrint(id)
      .then((res) => { 
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            //show the fingerprint number to the regsitered user
            alert('Your fingerprint number is ' + res.num + ' \n Keep it in mind. You would need it in future')
            //go to fingerprint
            setTimeout(() => {
              window.location.href = "/checkout"
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
const regUserPrint = (email) => {
        const data = {
           email: email
        }
        return fetch(`http://localhost:1000/reguserprint`, {
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
              <div className="modal_msg">Use simulated fingerprint</div>
              <div className="fingerprintselct">
                  <img onClick={() => regFingerPrint(1)} src={finger1} className='fingerprint_img' />
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
