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
    
    try {
        db.runTransaction(async (t) => {
            const data = (await t.get(db.collection("submissions").doc(user.uid))).data()
            
            if(data && data.status !== "rejected") {
                res.render('student/apply', {
                    status: true,
                    title: 'Course Application',
                    user,
                    courses: data
                })
            } else {
                const exemptionStatus = await t.get(db.collection("exemption").where("userId", "==", user.uid).where("status", "==", "approved"))
                let courses = (await db.collection('courses').get()).docs.map(course => Object.assign(course.data(), { id: course.id }))
                
                let exemptData = exemptionStatus.docs[0] ?? {}
                
                if(!exemptionStatus.empty) {
                    courses = courses.filter(course => !exemptData.data().courses.includes(course.id))
                }
                res.render('student/apply', {
                    title: 'Course Application',
                    courses,
                    user,
                    status: false
                })
            }
        })
    } catch(err) {
        console.log(err)
    }    
})

router.get('/exempt', async (req, res) => {
    const user = res.locals.user
    const db = firebase.firestore()
    
    try {
        await db.runTransaction( async (t) => {
            const doc = await t.get(db.collection('exemption').where('userId', '==', user.uid))
            if(doc.empty) {
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
    } catch (err) {
        console.log(err)
    }
})

router.post('/apply', async (req, res) => {
    const user = res.locals.user
    const db = firebase.firestore()
    const batch = db.batch()
    let data = {}
    
    if(req.body.appealStatus) {
        data = {
            submission: "pending"
        }
    } else {
        data = {
            submission: "approved"
        }
    }
    
    batch.set(db.collection('status').doc(user.uid), data, { merge: true })
    batch.set(db.collection('submissions').doc(user.uid), req.body)   
    
    batch.commit().then( () => res.send({ message: 'Success'}))
    
    
})

router.post('/exempt', async (req, res) => {
    const user = res.locals.user
    const data = req.body
    const db = firebase.firestore()
    let courses = []
    let grades = []
    let names = []
    
    data.forEach(see => {
        courses.push(see.id)
        grades.push(see.value)
        names.push(see.name)
    })
    
    const batch = db.batch()
    
    batch.set(db.collection('exemption').doc(), {
        userId: user.uid,
        status: "pending",
        courses,
        grades,
        names
    })
    
    batch.set(db.collection('status').doc(user.uid), {
        exemption: "pending"
    }, { merge: true })
    
    batch.commit().then( () => res.send({message: 'Success'}))
})

module.exports = router