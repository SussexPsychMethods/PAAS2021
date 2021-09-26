function GenerateGroup() {

    let groupid

    if (Math.random(0) > 0.5) {
        groupid = 'G1'
    } else {
        groupid = 'G2'
    }

    let el = document.getElementById('groupid')
    el.innerHTML = `Your group ID is: ${groupid}`

}

function GenerateID() {

    let el = document.getElementById("subenter")

    let entered = el.value

    let subid

    if (entered == "") {
        subid = "  Error! Enter your name and a random number"
    } else {

        subid = entered.match(/\b(\w)/g).join('')

        subid = "  " + subid + String(Math.floor(Math.random() * 100))
    }

    el = document.getElementById("subid")

    el.innerText = subid

}