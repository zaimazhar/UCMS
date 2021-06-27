const form = document.querySelector("form")
const uid = document.querySelector("#uid")
// const username = document.querySelector("#username")
// const email = document.querySelector("#email")
// const password = document.querySelector("#password")
const role = document.querySelector("#role")

form.addEventListener('submit', e => {
    e.preventDefault()

    giveRole(uid.value, role.value)
})