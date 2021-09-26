remark.macros.show = function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let show = urlParams.get("show") || 'false'

    if (show == 'true') {
        return this
    } else {
        return ''
    }

}


// remark.macros.test = function(){

//     let a = 'The pin goes here'
//     return a
// }