const form = document.querySelector("form")
const emailSel = document.querySelector("#email")
const passwordSel = document.querySelector("#password")
const err1 = document.querySelector("#err")

form.addEventListener('submit', e => {
    e.preventDefault()
    
    const email = emailSel.value
    const password = passwordSel.value

    console.log(`Submitted! ${email}: ${password}`)
    signInUSer(email, password)
})