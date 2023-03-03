function setSession(id) {
    localStorage.setItem("session", id)
}
function getSession(){return localStorage.getItem('session') || null}
export {setSession, getSession}