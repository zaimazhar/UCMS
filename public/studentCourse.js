const error = document.querySelector("#err")
const appeal = document.querySelector("#appeal")
const text = document.querySelector("textarea")
let exceeded = true
let count = 0

function submitApply(uid) {
    const checkboxes = document.querySelectorAll("input:checked")
    if(checkboxes.length === 0) {
        err.hidden = false
        setTimeout( () => err.hidden = true, 4000)
    } else {
        let arrayData = []
        
        if([...checkboxes].reduce((sum, el) => sum + parseInt(el.getAttribute('data-credit')), 0) > 10) {
            if(text.value == '') {
                alert("Exceeded Allowed Credit! Please fill in the appeal form")
                appeal.hidden = false
                return
            } else {
                checkboxes.forEach(box => {
                    arrayData.push(box.value)
                })

                fetch('/student/apply', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: uid,
                        courses: arrayData,
                        appeal: appeal.value
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                })
            }
        } else {
            checkboxes.forEach(box => {
                arrayData.push(box.value)
            })
        }
    }
}

// const form = document.querySelector('form')
// const checkboxes = document.querySelectorAll('input[type=checkbox]')

// form.addEventListener('submit', e => {
//     e.preventDefault()
//     let courses = []
//     checkboxes.forEach( box => {
//         if(box.checked) {
//             courses.push(box.value)
//         }
//     })

//     console.log(courses)
// })