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
        console.log("Not authenticated")
        res.redirect('/')
    } else {
        const user = await getUser(req.cookies.session)
        res.locals.user = user
        if(user.admin) {
            res.locals.user = user
            next()
        } else {
            console.log("Not an admin")
            res.redirect('/')
        }
    }
}

router.use(checkAuth)

router.get('/', async (req, res) => {
    const user = res.locals.user
    const users =await getAllUser()
    res.render('admin/admin', { 
        title: 'UCMS Admin',
        users: users,
        name: user.name,
        user
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
    
    await firebase.auth().setCustomUserClaims(uid, giveRole)

    console.log(uid)
    console.log(role)
    firebase.auth().getUser(uid).then( user => {
        console.log(user)
    }).catch( err => console.log(err))
})

router.get('/user', async (req, res) => {    
    const user = {
        email: 'aablowmeaway@gmail.com',
        emailVerified: false,
        phoneNumber: '+601164134713',
        password: 'zaimzaim1',
        displayName: 'Zaim Student',
        disabled: false,
    }
    const createdUser = await firebase.auth().createUser(user)

    console.log(createdUser)
})

module.exports = router