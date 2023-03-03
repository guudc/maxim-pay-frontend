import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import logo from '../../../img/icon.png'
import { getSession } from "../../components/session";
import { SERVER_LINK } from "../../../config.js";
import { E, onRender } from "../../components/utility";
import { _init_ } from "../../components/check";
import { hideModalInfo, ModalInfo, setModalMsg, setModalStaus, showModalInfo } from "../../components/infomodal";
let user = {}; const sign = {naira:'<strike>N</strike>'}

const getUser = () => {  
          const data = {
              b: getSession()
          }
          return fetch(SERVER_LINK + `/userdata`, {
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
const getOtherUser = (_user) => {  
  const data = {
      username: _user
  }
  return fetch(SERVER_LINK + `/getuser`, {
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
const transfer = (_amount, _receiver) => {
  //construct browser fingerprint
  const data = {
     b:getSession(), amount: _amount, username: _receiver
  }
  return fetch( SERVER_LINK + `/transfer`, {
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
export const Transfer = () => {
  const _init = () => {  
    //load the user details
    getUser()
    .then((res) => {  

        user = res.data
        _display()
    })
    .catch(err => {
        setTimeout(()=>{_init()},800)
    })
  }
  let canDo = false;
  const onUserNameInput = () => {
    const _val = E('user_input').value.trim()
    const _test = _val.replace(/ /g, "")
    canDo = false
    if(_test != "") {
      E('tx_loader').style.display = 'flex'
      getOtherUser(_val)
      .then(res => {
          if(res.status === true) {canDo = true
            //found
            E('shown').style.display = 'block'
            E('notshown').style.display = 'none'
            E('tx_loader').style.display = 'none'
            //showing the receiver name
            E('tx_name').innerHTML = res.data.name
            //show the sender balance
            E('tx_bal').innerHTML = "Balance: " + sign[user.currency] + (new Intl.NumberFormat('en-US').format((user.fiat)))
            //clear input
            E('tx_val').value = ""
            if(user.fiat > 0) {
              E('tx_val').disabled = false
            }
            else {
              //disable input value
              E('tx_val').disabled = true
            }
            //clear the total balance value
            E('tx_total').innerHTML = ""
          }
          else {
            E('shown').style.display = 'none'
            E('notshown').style.display = 'block'
            E('tx_loader').style.display = 'none'
          }
      })
      .catch(err => {
        setTimeout(() => {onUserNameInput()}, 1000)
      })
    }
    else {
      //clear both views and load
      E('shown').style.display = 'none'
      E('notshown').style.display = 'none'  
      E('tx_loader').style.display = 'none'
      
    }
  }
  const onUserValueInput = () => {
    let _val = E('tx_val').value.trim().replace(/ /g, "") * 1
    if(_val > 0) { 
      //calculate 1.5% 
      _val = ((1/100) * _val) + _val
      E('tx_total').innerHTML = 'Total: ' + sign[user.currency] + (new Intl.NumberFormat('en-US').format((_val)))
      if(_val <= user.fiat) {
        E('tx_send').disabled = false
        E('tx_val').style.borderColor = ''
        E('tx_val').style.color = ''
      }
      else {
        //show excedding balance warning
        E('tx_send').disabled = true
        E('tx_val').style.borderColor = 'red'
        E('tx_val').style.color = 'red'
      }
     
      
    }
    else {
      E('tx_total').innerHTML = ""
      E('tx_send').disabled = true
    }
  }
  const handleSubmit = (e) => { 
    e.preventDefault();
    let _val = E('tx_val').value.trim().replace(/ /g, "") * 1
    const _usr = E('user_input').value.trim()
     if(canDo) {
      //do validation
      showModalInfo(true); setModalMsg('Sending'); setModalStaus('')
      transfer(_val, _usr)
      .then((res) => {  
          if(res.status === true) {
            setModalMsg('Successfull'); setModalStaus('good')
            //update user details
            _init()
            E('user_input').value = ""
            E('shown').style.display = 'none'
            E('notshown').style.display = 'none'
          }
          else {
            if(res.msg.indexOf('session') > -1){res.msg = 'Something went wrong'}
              setModalMsg(res.msg); setModalStaus('error')
          }
          hideModalInfo(3500)
      })
      .catch((err) => { 
        
        setModalMsg('Network error'); setModalStaus('error');hideModalInfo(3500)  
      })
     }
   };
   _init()
  return (
    <section>
      <div className=" ">
            <div className="dashboard" style={{maxWidth:'350px'}}>
                    <div className="transfer_head left">
                        <span>Transfer</span>
                        <Link to='/wallet'>
                          <div className="top_button_div grey_btn">Cancel</div>
                          </Link>
                   </div>
                   <div className="left">
                        <input id='user_input' onInput={onUserNameInput} className="transfer_input" placeholder="Receiver username"/>
                   </div>
                   <div style={{borderTop:'1px solid rgba(0,0,0,.2)'}}>
                    <div id='tx_loader' className="transfer_loader"  style={{display:'none'}}></div>
                   </div>

                  <div id='shown' style={{display:'none'}}>
                      <div className="transfer_rx top">
                            <span className="rx_top">Receiver details</span>
                            <span id='tx_name' className="rx_det" style={{marginBottom:'10px'}}>Name</span>
                      </div>
                      <div className="topx">
                            <div className='left centre' style={{marginLeft:'15px'}}>
                              
                                  <input type="radio" checked name='radio' id="fiat" value="fiat" />
                                  <label htmlFor="fiat" className="rx_det" style={{marginRight:'10px'}}>Fiat</label>
                                
                            </div>
                            <div className="left">
                                <span className="rx_top" style={{marginLeft:'22px', marginRight:'auto'}}>Amount</span>
                                <span id='tx_bal' className="rx_top" style={{marginRight:'22px', color:'dodgerblue'}}>Balance</span>
                            </div>
                            <input onInput={onUserValueInput} id='tx_val' type='number' className="transfer_input" placeholder="Amount..." style={{marginTop:'5px'}}/>
                      </div>
                      <div className="transfer_rx topx" style={{background:'none', borderColor:'grey'}}>
                            <span className="rx_top">Transaction details</span>
                            <span className="rx_det">1% Tx fee</span>
                            <span id='tx_total' className="rx_det" style={{marginBottom:'10px'}}></span>
                      </div>
                      <div>
                            <button id='tx_send' onClick={handleSubmit} className="transfer_btn">SEND</button>
                      </div>
                  </div>

                  <div>
                  <div id='notshown' className="transfer_rx top left center" style={{display:'none',background:'none', border:'1px solid grey'}}>
                            <span className="rx_det">No user with the username found</span>
                  </div>
                     
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
