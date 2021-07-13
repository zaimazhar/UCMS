const form = document.querySelector('form')

form.addEventListener('submit', e => {
    e.preventDefault()
    
    const name = (document.querySelector('#cname')).value
    const credit = (document.querySelector('#ccredit')).value
    const code = (document.querySelector('#ccode')).value
    
    fetch('/admin/course/add', {
        method: 'POST',
        body: JSON.stringify({ name, credit, code }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    }).then( () => console.log('Success'))
    .catch( err => console.log(err))
})

async function deleteCourse(id) {
    const deleteRes = await fetch(`/admin/course/${id}/delete`, {
        method: 'POST',
    })
    
    console.log(deleteRes.body())
}