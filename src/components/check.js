import { SERVER_LINK } from "../../config"
import { getSession } from "./session"
let userData = null; 

//this check if the user is log in 

const check = () => {
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

const _init_ = () => {  
    userData = null
    check().then(res => {
        if(res.status !== true) {
            //log the user out
            window.location.href = "/login"
        }
        else {
            userData = res.data
        }
    })
    .catch(err => {
        setTimeout(() => {_init_()}, 1000)
    })
}
const getUserData = () => {
    return userData;
}

export {_init_, getUserData}