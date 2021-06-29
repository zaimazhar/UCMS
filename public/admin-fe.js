const form = document.querySelector("form")
const email = document.querySelector("#email")
const password = document.querySelector("#password")
const displayName = document.querySelector("#displayname")
const phoneNumber = document.querySelector("#phone")

form.addEventListener('submit', e => {
    e.preventDefault()
    createUser({
        email: email.value, 
        password: password.value, 
        displayName: displayName.value, 
        phoneNumber: phoneNumber.value
    })
})