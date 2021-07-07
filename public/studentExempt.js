const btn = document.querySelector("#submit")
const err = document.querySelector("#error")

btn.addEventListener('click', e => {
    e.preventDefault()

    const radios = document.querySelector('input[name="dd"]:checked')

    if(!radios) {
        err.hidden = false
        setTimeout(() => err.hidden = true, 4000)
    } else {
        console.log(radios.value)
    }
})