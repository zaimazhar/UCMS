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
                    arrayData.push({
                        name: box.getAttribute('data-name'),
                        credit: parseInt(box.getAttribute('data-credit')),
                        code: box.value,
                    })
                })
    
                fetch('/student/apply', {
                    method: 'POST',
                    body: JSON.stringify({
                        userId: uid,
                        courses: arrayData,
                        appealStatus: true,
                        status: "pending",
                        exceedCreditAppeal: text.value
                    }),
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                }).then( () => {
                    window.location.assign('/student')
                })
            }
        } else {
            if(!appeal.hidden) appeal.hidden = true

            checkboxes.forEach(box => {
                arrayData.push({
                    name: box.getAttribute('data-name'),
                    credit: parseInt(box.getAttribute('data-credit')),
                    code: box.value,
                })
            })

            fetch('/student/apply', {
                method: 'POST',
                body: JSON.stringify({
                    userId: uid,
                    courses: arrayData,
                    appealStatus: false,
                    status: "approved",
                    exceedCreditAppeal: ""
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then( () => {
                window.location.assign('/student')
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