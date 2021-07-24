const form = document.querySelector('form')
let courses = document.querySelector('#showCourses')

function createEl(el) {
    return document.createElement(el)
}

firebase.firestore().collection('courses').onSnapshot(data => {
    if(courses.firstChild) {
        while(courses.firstChild) {
            courses.removeChild(courses.firstChild)
        }    
    }

    data.forEach(courseData => {
        course = courseData.data()
        const tr = document.createElement('tr')
        const pName = createEl('p')
        const pCode = createEl('p')
        const pCredit = createEl('p')
        const tdName = createEl('td')
        const tdCode = createEl('td')
        const tdCredit = createEl('td')
        const tdBtn = createEl('td')
        const deleteBtn = document.createElement('button')
        tdBtn.classList.add('p-4')
        deleteBtn.classList.add('bg-red-500')
        deleteBtn.classList.add('px-4')
        deleteBtn.classList.add('py-2')
        deleteBtn.classList.add('rounded')
        deleteBtn.classList.add('transition')
        deleteBtn.classList.add('hover:bg-red-300')
        deleteBtn.innerText = 'Delete'
        deleteBtn.setAttribute('onclick', `deleteCourse('${courseData.id}')`)
        pName.innerText = course.name
        pCode.innerText = course.code
        pCredit.innerText = course.credit
        tdName.appendChild(pName)
        tdCode.appendChild(pCode)
        tdCredit.appendChild(pCredit)
        tdBtn.appendChild(deleteBtn)
        tr.appendChild(tdName)
        tr.appendChild(tdCode)
        tr.appendChild(tdCredit)
        tr.appendChild(tdBtn)
        courses.appendChild(tr)
    })
})

form.addEventListener('submit', e => {
    e.preventDefault()
    
    let name = document.querySelector('#cname').value
    let credit = document.querySelector('#ccredit').value
    let code = document.querySelector('#ccode').value
    let exemptionNode = document.querySelectorAll("input[name='exempt']:checked")
    let exemption = false;

    if(exemptionNode[0].value === "on") {
        exemption = true
    }

    fetch('/admin/course/add', {
        method: 'POST',
        body: JSON.stringify({ name, credit, code, exemption }),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
    })

    document.querySelector('#cname').value = ''
    document.querySelector('#ccredit').value = ''
    document.querySelector('#ccode').value = ''
    document.querySelector('#ctrue').value = ''
    document.querySelector('#cfalse').value = ''
})

async function deleteCourse(id) {
    await fetch(`/admin/course/${id}/delete`, {
        method: 'POST',
    })
}