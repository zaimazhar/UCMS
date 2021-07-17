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
    const applicationSubmission = (await firebase.firestore().collection("status").where("userId", "==", user.uid).get()).docs[0].data()
    console.log(applicationSubmission)
    res.render('student/student', {
        title: 'Student Dashboard',
        user,
        applicationSubmission: applicationSubmission.submission,
        exemptionSubmission: applicationSubmission.exemption
    })
})

router.get('/apply', async (req, res) => {
    const user = res.locals.user
    console.log(user.uid)

    const data = (await firebase.firestore().collection("submissions").where("userId", "==", user.uid).where("status", "!=", "rejected").get()).docs

    if(data.length > 0) {
        res.render('student/apply', {
            status: true,
            title: 'Course Application',
            user,
            courses: data.map(query => query.data().status)
        })
    } else {
        const courses = (await firebase.firestore().collection('courses').get()).docs.map(course => Object.assign(course.data(), { id: course.id }))
    
        res.render('student/apply', {
            title: 'Course Application',
            courses,
            user,
            status: false
        })
    }
})

router.get('/exempt', async (req, res) => {
    const user = res.locals.user
    res.render('student/exempt', {
        title: 'Exemption'
    })
})

router.post('/apply', async (req, res) => {
    const user = res.locals.user
    firebase.firestore().collection('submissions').add(req.body)
})

module.exports = router