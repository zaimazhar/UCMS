const form = document.querySelector("form")
const uid = document.querySelector("#uid")
const role = document.querySelector("#role")

form.addEventListener('submit', e => {
    e.preventDefault()
    giveRole(uid.value, role.value)
})