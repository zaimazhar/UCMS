const admin = require('firebase-admin')

var serviceAccount = require("../../key/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

function app() {
    return admin
}

async function createUser() {
    return admin.auth().createUser({
        email: 'zaim.azhar97@gmail.com',
        emailVerified: false,
        phoneNumber: '+601164134714',
        password: 'Zaimzaim1@',
        displayName: 'zaimazhar97',
        disabled: false,
      })
}

async function createUser(userData, role) {
    let user = {
        emailVerified: false,
        disabled: false,
    }

    let data = { ...user, ...userData }

    admin.auth().createUser(data)
}

async function checkPermission(sessionId) {
    const verifiedUid = await admin.auth().verifySessionCookie(sessionId)
    return admin.auth().verifyIdToken(verifiedUid.uid)
}

function authUser(uid, expiresIn) {
    admin.auth().createSessionCookie(uid, { expiresIn }).then(session => {
        console.log(`In FB function, ${session}`)
        return session
    })
}

async function assignRoleAdmin() {
    admin.auth().setCustomUserClaims()
}

async function verifyJWT(jwt) {
    try {
        const user = await admin.auth().verifyIdToken(jwt)
    } catch(err) {
        console.error('Error is: ' + err)
    }
}

module.exports = {
    app,
    createUser,
    authUser,
    verifyJWT,
    assignRoleAdmin,
    checkPermission,
}