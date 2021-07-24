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
    const applicationSubmission = (await firebase.firestore().collection('status').doc(user.uid).get()).data() ?? { submission: '', exemption: ''}
    
    res.render('student/student', {
        title: 'Student Dashboard',
        user,
        applicationSubmission: applicationSubmission.submission,
        exemptionSubmission: applicationSubmission.exemption
    })
})

router.get('/apply', async (req, res) => {
    const user = res.locals.user
    const db = firebase.firestore()
    console.log(user.uid)

    const exemptionStatus = await db.collection("exemption").where("userId", "==", user.uid).where("status", "==", "approved").get()
    
    const data = await (await db.collection("submissions").doc(user.uid).get()).data()
    
    if(data && data.status !== "rejected") {
        res.render('student/apply', {
            status: true,
            title: 'Course Application',
            user,
            courses: data
        })
    } else {
        let courses = (await db.collection('courses').get()).docs.map(course => Object.assign(course.data(), { id: course.id }))

        if(!exemptionStatus.empty) {
            courses = courses.filter(course => !course.id.includes(exemptionStatus.docs[0].data().courses))
        }
        
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
    const db = firebase.firestore()

    if((await db.collection('exemption').where('userId', '==', user.uid).get()).empty) {
        const courses = await (await db.collection('courses').where('exemption', '==', true).get()).docs.map(course => Object.assign(course.data(), { id: course.id }))
    
        res.render('student/exempt', {
            title: 'Exemption',
            courses,
            status: false
        })
    } else {
        res.render('student/exempt', {
            title: 'Exemption',
            status: true
        })
    }

})

router.post('/apply', async (req, res) => {
    const user = res.locals.user
    const db = firebase.firestore()
    const batch = db.batch()
    
    if(req.body.appealStatus) {
        db.collection('status').doc(user.uid).set({
            submission: "pending"
        }, { merge: true })
    } else {
        db.collection('status').doc(user.uid).set({
            submission: "approved"
        }, { merge: true })
    }
    
    db.collection('submissions').doc(user.uid).set(req.body)
    
    batch.commit()

    res.send({ message: 'Success'})
})

router.post('/exempt', async (req, res) => {
    const user = res.locals.user
    const data = req.body
    let courses = []
    let grades = []

    data.forEach(see => {
        courses.push(see.id)
        grades.push(see.value)
    })

    const batch = firebase.firestore().batch()

    firebase.firestore().collection('exemption').add({
        userId: user.uid,
        status: "pending",
        courses,
        grades
    })

    firebase.firestore().collection('status').doc(user.uid).set({
        exemption: "pending"
    }, { merge: true })

    batch.commit()

    res.send({message: 'Success'})
})

module.exports = router