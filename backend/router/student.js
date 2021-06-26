const express = require('express')
const firebase = require('firebase-admin')
const router = express.Router()

function getUser(session) {
    return firebase.auth().verifySessionCookie(session, true)
}

const auth = async (req, res, next) => {
    if(req.cookies.session) {
        res.locals.user = await getUser(req.cookies.session)
        next()
    } else {
        console.log("NOOOO !!!!")
        res.redirect('../')
    }
}

router.get('/', auth, async (req, res) => {
    const user = res.locals.user
    res.render('client/client', {
        title: 'Student Dashboard',
        user
    })
})

module.exports = router