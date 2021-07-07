const express = require('express')
const firebase = require('firebase-admin')
const router = express.Router()

function getUser(session) {
    return firebase.auth().verifySessionCookie(session, true)
}

const auth = async (req, res, next) => {
    if(!req.cookies.session) {
        console.log("Not authenticated")
        res.redirect('/')
    } else {
        const user = await getUser(req.cookies.session)
        res.locals.user = user
        if(user.student) {
            res.locals.user = user
            next()
        } else {
            console.log("Not a student")
            res.redirect('/')
        }
    }
}

router.use(auth)

router.get('/', async (req, res) => {
    const user = res.locals.user
    res.render('student/student', {
        title: 'Student Dashboard',
        user
    })
})

router.get('/apply', async (req, res) => {
    const user = res.locals.user
    res.render('student/apply', {
        title: 'Course Application',
        courses: [{ 
            id: 'o8Z3vTih5RnWyvj4wZlN',
            name: 'Software Engineering', 
            credit: 3,
            code: 'ABC123'
        }, {
            id: 'Qg0SMZajXjHd8xWvFlVe',
            name: 'Database Management',
            credit: 4,
            code: 'BAC123'
        }, {
            id: 'qlGGCPcKYzDOIFQqGrGI',
            name: 'Cloud Computing',
            credit: 4,
            code: 'CCC123'
        }],
        user
    })
})

router.get('/exempt', async (req, res) => {
    const user = res.locals.user
    res.render('student/exempt', {
        title: 'Exemption'
    })
})

module.exports = router