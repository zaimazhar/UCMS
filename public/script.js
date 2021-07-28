  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyC9bB74XF7toEmXqBSjN_En9Pg95C3HFu4",
    authDomain: "ucms-b2b63.firebaseapp.com",
    projectId: "ucms-b2b63",
    storageBucket: "ucms-b2b63.appspot.com",
    messagingSenderId: "954519226347",
    appId: "1:954519226347:web:242d6f720e844c8b4cfbae"
  }
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  
  async function signInUSer(email, password) {
    try {
      firebase.auth().signInWithEmailAndPassword(email, password).then(({user}) => {
        return user.getIdToken().then( idToken => {
          return fetch('/sessionStart', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({idToken})
          }).catch( () => {})
        })
        .then( () => {
          return firebase.auth().signOut()
        })
        .then( () => {
          return window.location.assign('/')
        })
      }).catch( () => {
        err1.hidden = false
        setTimeout( () => err1.hidden = true, 5000)
      })
    } catch(err) {
      
    }
  }
  
  async function giveRole(uid, role) {
    fetch('/admin/role', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uid, role})
    }).then( claim => window.location.assign('/admin'))
  }
  
  async function createUser(userData) {
    fetch('/admin/user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    }).then( user => { window.location.assign('/admin') })
  }
  