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
    const users = await getAllUser()
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
    const db = firebase.firestore()
    
    try {
        db.runTransaction( async (t) => {
            let submissions = (await t.get(db.collection('submissions').where('status', '==', 'pending'))).docs.map( data => Object.assign(data.data(), { id: data.id }))
            
            submissions = await Promise.all(submissions.map(async submission => {
                return Object.assign(submission, { name: (await firebase.auth().getUser(submission.id)).displayName })
            }))
            
            res.render('admin/appeal', {
                title: 'Course Appeal',
                submissions
            })
        })
    } catch (err) { 
        console.log(err)
    }
})

router.get('/exemption', async (req, res) => {
    const db = firebase.firestore()
    
    try {
        db.runTransaction( async (t) => {
            let exemptions = (await t.get(db.collection('exemption').where('status', '==', 'pending'))).docs.map( data => Object.assign(data.data()))
            
            exemptions = await Promise.all(exemptions.map(async exempt => {
                return Object.assign(exempt, { name: (await firebase.auth().getUser(exempt.userId)).displayName })
            }))
            
            res.render('admin/exemption', {
                title: 'Course Appeal',
                exemptions
            })
        })
    } catch (err) { 
        console.log(err)
    }
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

router.get('/:uid/exempt/confirm', async (req, res) => {
    const db = firebase.firestore()
    const batch = db.batch()
    
    db.collection('exemption').where('userId', '==', req.params.uid).get().then(exempt => {
        db.collection('exemption').doc(exempt.docs[0].id).set({ status: "approved" }, { merge: true })
    })
    
    batch.set(db.collection('status').doc(req.params.uid), {
        exemption: "approved"
    }, { merge: true })
    
    const status = (await db.collection('submissions').doc(req.params.uid).get()).data()
    
    if(status) {
        const exempt = (await db.collection('exemption').where('userId', '==', req.params.uid).get()).docs[0].data()
        const newCourse = status.courses.filter(course => !exempt.courses.includes(course.id))
        batch.set(db.collection('submissions').doc(req.params.uid), {
            courses: newCourse
        }, { merge: true })
    }
    
    
    batch.commit()
    res.redirect('/admin/exemption')
})

router.get('/:uid/exempt/reject', async (req, res) => {
    const db = firebase.firestore()
    const batch = db.batch()
    
    db.collection('exemption').where('userId', '==', req.params.uid).get().then(exempt => {
        db.collection('exemption').doc(exempt.docs[0].id).set({ status: "rejected" }, { merge: true })
    })

    batch.set(db.collection('status').doc(req.params.uid), {
        exemption: "rejected"
    }, { merge: true })
    
    batch.commit()
    
    res.redirect('/admin/exemption')
})

router.get('/:uid/appeal/confirm', async (req, res) => {
    const db = firebase.firestore()
    const batch = db.batch()
    
    batch.update(db.collection('submissions').doc(req.params.uid), { status: "approved" })
    batch.set(db.collection('status').doc(req.params.uid), { submission: "approved" }, { merge: true })
    
    batch.commit()
    
    res.redirect('/admin/appeal')
})

router.get('/:uid/appeal/reject', async (req, res) => {
    const db = firebase.firestore()
    const batch = db.batch()
    
    batch.update(db.collection('submissions').doc(req.params.uid), { status: "rejected" })
    batch.set(db.collection('status').doc(req.params.uid), { submission: "rejected" }, { merge: true })
    
    batch.commit()
    
    res.redirect('/admin/appeal')
})

router.post('/role', async (req, res) => { 
    const { uid, role } = req.body
    
    if(role === 'student') {
        firebase.firestore().collection("status").add({
            userId: uid,
            submission: "",
            exemption: "",
        })
    }
    
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
        credit: parseInt(req.body.credit),
        exemption: req.body.exemption
    })
})

router.post('/course/:id/delete', async (req, res) => {
    firebase.firestore().collection('courses').doc(req.params.id).delete()
})

module.exports = router