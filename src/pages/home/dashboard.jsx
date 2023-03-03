import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";
import logo from '../../../img/icon.png'
import { getSession } from "../../components/session";
import { paystack_priv_key, SERVER_LINK } from "../../../config.js";
import { E } from "../../components/utility";
import { _init_ } from "../../components/check";
import { ModalInfo, setInfo, setModalMsg } from "../../components/infomodal";
import { useEffect } from "react";

let user = {}; const sign = {naira:'<strike>N</strike>'}
let txlist = null

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
const logout = () => {
    const data = {
        b: getSession()
    }
    return fetch(SERVER_LINK + `/logout`, {
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
const getTx = (_usr) => {
    const data = {
        username: _usr
    }
    return fetch(SERVER_LINK + `/gettransfer`, {
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
const _logout = () => {  
    setModalMsg("Signing out")
    logout().then(res => {
        if(res.status === true) {
            //log the user out
            window.location.href = "/login"
        }
    })
}
const createDeposit = (amount) => {
    const data = {
        username:user.username,
        amount: amount 
    }
    return fetch(SERVER_LINK + `/createpayment`, {
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
const verify = (ref) => {
    const data = {
         ref:ref
    }
    return fetch(SERVER_LINK + `/payment`, {
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
const verifyAll = () => { 
    const data = {
         username: user.username
    }
    return fetch(SERVER_LINK + `/validatepayment`, {
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
    E('loading_modal').style.display = "none"
    //displaying name
    E('user_name').innerHTML = user.name
    E('total_balance').innerHTML = sign[user.currency] + "" + (new Intl.NumberFormat('en-US').format((user.fiat + user.usda)))
    E('fiat').innerHTML = sign[user.currency] + "" + (new Intl.NumberFormat('en-US').format((user.fiat)))
    E('usda').innerHTML = sign[user.currency] + "" + (new Intl.NumberFormat('en-US').format((user.usda)))
    //run get transactions
   
}
const txItem = (item) => { 
    let isSend = item.sender == user.username;
    const currentDate = new Date(item.data.date);
    const options = {  year: 'numeric', month: 'short', day: 'numeric' };
    item.data.amount =  (new Intl.NumberFormat('en-US').format((item.data.amount)))
    item.data[user.username] = item.data[user.username] || {fiat:0,usda:0}
    item.data[user.username].fiat =  (new Intl.NumberFormat('en-US').format((item.data[user.username].fiat)))
    let anim = 'left txs txs_in';
    if(isSend) {
       anim = 'left txs txs_out'
    }
    let lnk = '/Tx?id=' + item.id
    return (
        <Link key={item.id} to={lnk}>
        <div   className={anim}>
        <div className="tx_first topx">
            <div className="tx_header left">
                <div style={{marginRight:'5px'}}>
                    {isSend ? (
        <span className="fas fa-arrow-right" style={{color:'red'}}></span>
                    ) : (
                        <span className="fas fa-arrow-left" style={{color:'limegreen'}}></span>
                    )}
                    
             </div>
                <span>{isSend ? 'Transfer' : 'Received' }</span>
            </div>
            <span className="tx_bottom">{
              currentDate.toLocaleDateString('en-US', options)
            } <b>
                 {isSend ? (
                    `to ${item.receiver}`
                 ) :
                 (
                    `from ${item.sender}`
                 )}
            </b></span>
        </div>
        <div className="tx_second topx">
        {isSend ? (
   <span className="tx_header" style={{color:'red',marginLeft:'auto'}}>  
     -<strike>N</strike>{item.data.amount}          
   </span>
        ) : (
            <span className="tx_header" style={{color:'limegreen',marginLeft:'auto'}}>  
            +<strike>N</strike>{item.data.amount}          
          </span> 
        )}
            
            <span className="tx_bottom"> bal: <strike>N</strike>
                {`${item.data[user.username].fiat}`}
                </span>
        </div>
        
     </div>
     </Link>
    )
}
const vAll = () => {
    verifyAll().then(res => 
      {if(res.status === false)
        {/* Redo again */ 
          setTimeout(vAll, 5000)
        }})
        .catch(err => {vAll()})
        
}
export const Dashboard = () => {
    let [txs, setTxList] = useState()
    let editLink = "/edit"
  const _init = () => {
    //load the user details
    getUser()
    .then((res) => {  
        if(JSON.stringify(user) != JSON.stringify(res.data)) {  
          user = res.data
          _display()
          loadTx()
          vAll()
       }
        else {_display()}
    })
    .catch(err => {
        setTimeout(()=>{_init()},800)
    })
  }
   _init_()
   
   useEffect(() => {
    // setPosts Here
    _init()
   
  }, [txs]);

  const startExternalPayment = (amount, ref) => {
    E('fund_modal').style.display = 'none';  
    const auth = () => {
      //cancel this payment at the server
      verify(ref)
      .then(res => {
          if(res.status === true) {
              //successfull deposit, reload transaction
              _init()
          }
      })  
      .catch(err => {
          //redo it
          auth()
      })  
    }
    let handler = PaystackPop.setup({
      key: paystack_priv_key, // Replace with your public key
      email: user.id,
      amount: amount * 100,
      ref: ref, // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      currency: 'NGN',
      label: 'Fund your wallet',
      onClose: auth,
      callback: auth
    });
  
    handler.openIframe();
    
  } 
  const loadTx = () => {
    getTx(user.username)
    .then(tx => {
        if(tx.status == true) {  
            tx = tx.data;  
            txlist = (tx.map((item, index)=>{  
                return txItem(item)
          }))
          setTxList(Math.random())
          
        }
    })
    .catch(err => { console.log(err)
        setTimeout(() =>{loadTx()}, 1000)
    })
  }
  const deposit = () => {
    //show the fund_loading modal
    const amount = prompt('Amount') || 1000
    E('fund_modal').style.display = 'flex'
    createDeposit(amount)
    .then(res => {  
        //start the paystack
        startExternalPayment(amount, res.id)
    })
    .catch(err => { 
        setInfo({
            msg:'Something went wrong',
            status:'error'
        })
    })
  }
  return (
    <section>
      <div className=" ">
            <div className="dashboard">
                <div className="top">
                   <div className="left centre">
                     <img src={logo} style={{maxWidth:'25px', maxHeight:'25px', marginRight:'7px'}} />
                    <h4 style={{color:'rgb(15, 17, 89)'}}>MaximPay</h4>
                     <div className="top_button left centre">
                        <Link to={editLink}><div className="top_button_span"><i className="fas fa-cog"></i></div></Link>
                        <div onClick={_logout} className="top_button_div">Sign out</div>
                    </div>
                   </div> 
                     <div className="left centre" style={{marginTop:'0px'}}>
                        <span id='user_name' className="inLineText" style={{color:'#2f2f21', fontSize:'14px'}}></span>
                     </div>
                   
                </div>

                <div className="left balance" style={{flexDirection:'column'}}>
                    <font>Total Balance</font>
                    <font id='total_balance' style={{fontWeight:'bold'}}></font>
                </div>
                <div className="top tleft" style={{marginTop:'30px'}}>
                    <div className="card">
                        <div className="left">
                            <div className="card_bal">
                                <span>Balance</span>
                                <font id='fiat'></font>
                            </div>
                            <div className="card_icon">
                                <i className="fas fa-money-bill"></i>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="left">
                            <div className="card_bal">
                                <span>USDA Balance</span>
                                <font id='usda'></font>
                            </div>
                            <div className="card_icon">
                                <i className="fab fa-ethereum"></i>
                            </div>
                        </div>
                        <font className='card_rate'>1 USDA = <strike>$</strike>1</font>
                    </div>

                </div>

                <div className="left center" style={{marginTop:'20px'}}>
                    <div className="wallet_buttons center">
                        <button onClick={deposit}><i className="fas fa-arrow-down"></i></button>
                        <font>Deposit</font>
                    </div>

                   <Link to='/Transfer'>
                     <div className="wallet_buttons center" style={{marginRight:'0px'}}>
                        <button><i className="fas fa-arrow-up"></i></button>
                        <font>Send</font>
                    </div>
                    </Link>
                </div>

                <div className="tx">
                    <span className="tx_head">Transactions</span>
                    <div className="tx_list">
                        {txlist}
                    </div>  
                </div>
            </div> 
      </div>
      <div id='loading_modal' className="loading_modal left center">
          <span className='fas fa-spinner fa-spin fa-3x' style={{marginTop:'0px'}}></span>
      </div>
     <div id='fund_modal' className="fund_modal">
        <span className="fas fa-spinner fa-spin fa-3x"></span>
    </div>    
    <ModalInfo />  
    </section>
  );
};
