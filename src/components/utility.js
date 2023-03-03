
const onRender = (_renderId, _callback) => {
    const tmr = setInterval(() => {
        const _element = document.getElementById(_renderId)
        if(_element != null) {
            clearInterval(tmr)
            //has rendered
            if(_callback != null) {
                _callback()
            }
        }
    }, 500)
}
const onToggle = (_id, _callback) => {
    onRender(_id, () => {
        //set onclick functions of the main toggle
        const _toggle = document.getElementById(_id);
        if(_toggle != null) {
            const _toggleChild = _toggle.children 
            for(let i=0;i<_toggleChild.length;i++) {
                _toggleChild[i].onclick = (event) => {
                    //reset all choose
                    for(let i=0;i<_toggleChild.length;i++) {
                        _toggleChild[i].className = ""
                    }
                    //select this one
                    event.target.className = "stake_toggle_select"
                    if(_callback != null) {
                        _callback(event.target.innerText)
                    }
                }
            }
        }
    })
}

const E = (_id) => {
    return document.getElementById(_id)
}
 

const G = ( name, url ) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
const formatNumber = (num) => {
    return (Intl.NumberFormat('en-US', {maximumSignificantDigits: 12}).format(num || ""));
}
export {onRender, onToggle, E, G, formatNumber};