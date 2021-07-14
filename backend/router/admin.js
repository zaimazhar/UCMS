const express = require('express')
const firebase = require('firebase-admin')
const router = express.Router()

function getUser(session) {
    return firebase.auth().verifySessionCookie(session, true)
}

function getAllUser() {
    return firebase.auth().listUsers().then(app => {
        return app.users
    })
}

const checkAuth = async (req, res, next) => {
    if(!req.cookies.session) {
        res.redirect('/')
    } else {
        const user = await getUser(req.cookies.session)
        res.locals.user = user
        if(user.admin) {
            res.locals.user = user
            next()
        } else {
            res.redirect('/')
        }
    }
}

router.use(checkAuth)

router.get('/', async (req, res) => {
    const user = res.locals.user
    const users =await getAllUser()
    // users.map(use => console.log(use.customClaims))
    res.render('admin/admin', { 
        title: 'UCMS Admin',
        users: users,
        name: user.name,
        user
    })
})

router.get('/courses', async (req, res) => {
    // const courses = (await firebase.firestore().collection('courses').get()).docs.map(course => Object.assign(course.data(), { id: course.id }))
    res.render('admin/course', {
        title: 'Courses',
        // courses
    })
})

router.get('/appeal', async (req, res) => {
    res.render('admin/appeal', {
        title: 'Course Appeal'
    })
})

router.get('/exemption', async (req, res) => {
    res.render('admin/exemption', {
        title: 'Exemption'
    })
})

router.get('/:uid/user', async (req, res) => {
    const user = res.locals.user
    const userProfile = await firebase.auth().getUser(req.params.uid)
    res.render('admin/userprofile', {
        title: `User: ${req.params.uid}`,
        user,
        userProfile,
    })
})

router.post('/role', async (req, res) => { 
    const { uid, role } = req.body
    const giveRole = role === 'admin' ? { admin: true } : { student: true }
    
    firebase.auth().setCustomUserClaims(uid, giveRole)
    .then( claim => {
        res.redirect(`/`)
    })
})

router.post('/user', async (req, res) => {
    const user = { ...req.body, ...{ emailVerified: false, disabled: false } }  
    firebase.auth().createUser(user).then( user => {
        res.redirect('/')
    })
})

router.post('/course/add', async (req, res) => {
    firebase.firestore().collection('courses').add({
        name: req.body.name,
        code: req.body.code,
        credit: parseInt(req.body.credit)
    })
})

router.post('/course/:id/delete', async (req, res) => {
    firebase.firestore().collection('courses').doc(req.params.id).delete()
})

module.exports = router