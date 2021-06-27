const express = require('express')
const jwt = require('express-jwt')
const cookieParser = require('cookie-parser')
const path = require('path')

const page = require('./backend/services/page')
const firebase = require('firebase-admin')
const admin = require('./backend/router/admin')
const student = require('./backend/router/student')
const PORT = 3000 || process.env.PORT

// Initialize ExpressJS
const app = express()

const serviceAccount = require("./key/serviceAccountKey.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

// Application Configuration
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(express.json())

// Additional Function
function getUser(session) {
    return firebase.auth().verifySessionCookie(session, true)
}

// Middleware functions
const authorize = async (req, res, next) => {
    console.log('Middleware working')
    if(!req.cookies.session) {
        next()
    } else {
        user = await getUser(req.cookies.session)
        
        if(user.admin) {
            res.redirect('/admin')
        } else {
            res.redirect('/student')
        }
    }
    
}

// Rendering Engine Initialization
app.set('view engine', 'pug')
app.set('views', path.join(__dirname + '/views'))

// Sub-Routes
app.use('/admin', admin)
app.use('/student', student)

// Middlewares
// app.use(authorize)

// Routes
app.get('/', authorize, async (req, res) => {
    res.render('index', { 
        title: 'UCMS',
        name: 'Zaim',
        user: false
    })
})

app.post('/sessionStart', (req, res) => {
    // console.log(`Firebase Token: ${req.body.idToken}`)
    if(req.body.idToken) {
        const token = req.body.idToken.toString()
        const expiresIn = 60 * 60 * 24 * 1000 * 3

        firebase.auth().createSessionCookie(token, {expiresIn}).then(session => {
            res.cookie('session', session, {
                httpOnly: true,
                maxAge: expiresIn,
                secure: true
            })
            res.cookie('uid', req.body.idToken, {
                httpOnly: true,
                maxAge: expiresIn,
                secure: true
            })
            res.redirect('/')
        })
    } else {
        res.status(401).send("UNAUTHORIZED ATTEMPT")
    }
})

app.get('/sessionEnd', (req, res) => {
    res.clearCookie('session')
    res.clearCookie('uid')
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})