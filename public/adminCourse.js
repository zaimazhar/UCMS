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