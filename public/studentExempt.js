const btn = document.querySelector("#submit")
const selectors = document.querySelectorAll('select')
const err = document.querySelector("#error")

btn.addEventListener('click', () => {
    let data = []
    selectors.forEach(selector => {
        const id = selector.dataset.course
        data.push({
            id,
            value: selector.value
        })
    })
    
    fetch('/student/exempt', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then( () => window.location.assign('/student/exempt'))
})