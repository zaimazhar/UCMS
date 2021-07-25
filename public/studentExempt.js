const btn = document.querySelector("#submit")
const selectors = document.querySelectorAll('select')
const err = document.querySelector("#error")

btn.addEventListener('click', () => {
    let data = []
    selectors.forEach(selector => {
        const id = selector.dataset.course
        const name = selector.dataset.name
        data.push({
            id,
            value: selector.value,
            name
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