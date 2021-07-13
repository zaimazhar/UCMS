const btn = document.querySelector("#submit")
const error = document.querySelector("#err")
const appeal = document.querySelector("#appeal")
const text = document.querySelector("textarea")
let exceeded = true
let count = 0

btn.addEventListener('click', e => {
    e.preventDefault()
    const checkboxes = document.querySelectorAll("input:checked")
    if(checkboxes.length === 0) {
        err.hidden = false
        setTimeout( () => err.hidden = true, 4000)
    } else {
        let arrayData = []

        checkboxes.forEach( box => {
            count +=  parseInt(box.getAttribute('data-credit'))
            if(count > 10 && exceeded) {
                exceeded = !exceeded
                count = 0
                alert("Exceeded Allowed Credit! Please fill in the appeal form")
                appeal.hidden = false
                return
            } else {
                arrayData.push(box.value)
            }
        })
    }

    count = 0
})

const form = document.querySelector('form')
const checkboxes = document.querySelectorAll('input[type=checkbox]')

form.addEventListener('submit', e => {
    e.preventDefault()
    let courses = []
    checkboxes.forEach( box => {
        if(box.checked) {
            courses.push(box.value)
        }
    })

    console.log(courses)
})