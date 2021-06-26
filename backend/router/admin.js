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
        name: `${user.name}`,
        user
    })
    console.log("ADMIN !!!!")
})

router.get('/auth', (req, res) => {
    res.render('admin/admin', { 
        title: 'UCMS Admin',
        name: req.query.name
    })
    console.log("ADMIN !!!!")
})

router.post('/permission', (req, res) => {
    
})

router.post('/roles', async (req,res) => {    
    const uid = req.body.uid
    const role = req.body.role
    const success = await firebase.auth().setCustomUserClaims(uid, { role })
    console.log(success)
})

module.exports = router