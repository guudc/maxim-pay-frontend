import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import logo from '../../../img/icon.png'
import { getSession } from "../../components/session";
import { SERVER_LINK } from "../../../config.js";
import { E, G, onRender } from "../../components/utility";
import { getUserData, _init_ } from "../../components/check";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../../components/infomodal";
let user = {}; const sign = {naira:'<strike>N</strike>'}

const getTx = (id) => {  
          const data = {
              id: id
          }
          return fetch(SERVER_LINK + `/gettx`, {
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


const _display = ()=> {  
    //display data
    onRender('loading_modal', () => {
      E('loading_modal').style.display = "none"
   })
    
}
export const Tx = () => {
  const _init = () => {   
    //load the user details
    const tmr = setInterval(() => {
        if(getUserData() != null) {
            //stop timer
            clearInterval(tmr); 
            getTx(G('id'))
            .then(tx => {   
                if(tx.status == true) { tx = tx.data
                    //show tx details
                    if(tx.sender == getUserData().username) {
                        E('tx_type').innerHTML = 'Sent'
                        E('tx_name').innerHTML = tx.receiver_name
                        E('tx_user').innerHTML = tx.receiver
                        E('tx_type_head').innerHTML = 'Receiver details'
                        E('tx_total').style.color = 'red'
                        E('tx_type').style.color = 'red'
                    }
                    else {
                        E('tx_type').innerHTML = 'Received';
                        E('tx_name').innerHTML = tx.sender_name
                        E('tx_user').innerHTML = tx.sender
                        E('tx_type_head').innerHTML = 'Sender details'
                        E('tx_total').style.color = 'limegreen'
                        E('tx_type').style.color = 'limegreen'
                    }
                    E('tx_token').innerHTML = '<b>Type</b>: fiat'
                    const currentDate = new Date(tx.data.date);
                    const options = { weekday:'long', year: 'numeric', month: 'short', day: 'numeric' };
                    E('tx_date').innerHTML = '<b>Type</b>: ' + currentDate.toLocaleDateString('en-US', options)
                    E('tx_bal').innerHTML = "Balance at the time: " + sign[getUserData().currency] + (new Intl.NumberFormat('en-US').format((tx.data[getUserData().username].fiat)))
                    E('tx_total').innerHTML = "Amount: " + sign[getUserData().currency] + (new Intl.NumberFormat('en-US').format((tx.data.amount)))
                    E('tx_id').innerHTML = '<b>Tx id</b>: ' + tx.id
                    E('loading_modal').style.display = 'none'
                    E('shown').style.display = 'block'
                }
                else {
                    showModalInfo(true); setModalMsg('Something went wrong');setModalStaus('error');
                    hideModalInfo(3000)
                    setTimeout(() => {
                        window.location = '/wallet'
                    }, 3000)
                }
            })
            .catch(err => { console.log(err)
                setTimeout(() => {_init()}, 1000)
            })
        }
    }, 1000)
  }
  
   _init()
  return (
    <section>
      <div className=" ">
            <div className="dashboard" style={{maxWidth:'350px'}}>
                    <div className="transfer_head left">
                        <span>Transaction details</span>
                        <Link to='/wallet'>
                          <div className="top_button_div grey_btn">Cancel</div>
                          </Link>
                   </div>
                  
                  <div id='shown' style={{display:'none'}}>
                  <div className="transfer_rx topx" style={{background:'none', borderColor:'grey'}}>
                            <span className="rx_top"><b id='tx_type'>Send</b></span>
                            <span id='tx_token' className="rx_det" style={{marginBottom:'0px'}}>Fiat</span>
                            <span id='tx_date' className="rx_det" style={{marginBottom:'0px'}}>date</span>
                            <span id='tx_id' className="rx_det" style={{marginBottom:'10px'}}>tx id</span>
                      </div>
                      <div className="transfer_rx top">
                            <span id='tx_type_head' className="rx_top">Receiver details</span>
                            <span id='tx_user' className="rx_det" style={{marginBottom:'0px'}}>Name</span>
                            <span id='tx_name' className="rx_det" style={{marginBottom:'10px'}}>Name</span>
                      </div>
                      
                      <div className="transfer_rx topx" style={{background:'none', borderColor:'grey'}}>
                            <span className="rx_top">Transaction details</span>
                            <span id='tx_total' className="rx_det" style={{marginBottom:'0px'}}>Amount</span>
                            <span id='tx_bal' className="rx_det" style={{marginBottom:'10px'}}>Balance at the time: </span>
                      </div>
                      <div>
                      </div>
                  </div>

                  <div>
                  
                     
                  </div>

            </div>
      </div>
       
      <div id='loading_modal' className="loading_modal left center">
          <span className='fas fa-spinner fa-spin fa-3x' style={{marginTop:'0px'}}></span>
      </div>
      {_init_()}
      <ModalInfo />
    </section>
  );
};
