# University Course Management System (UCMS)
## Description
UCMS is a course management system for higher educational institutions. The system will have the following features:
- Authentication (JWT Session Cookie)
- Authorization (Role-Based) for both Student and Administrator
- Student creation and view of courses
- Student exceeded credit hour appeal
- Student exemption submission
- Administrator creation, view, deletion, and update of courses
- Administrator appeal approval
- Administrator exemption approval

## Stack
- Pug templating engine
- ExpressJS
- Firebase (Admin SDK)

## READ FIRST!
### Install all depedencies
- On your root path, where `package.json` reside. Type `npm install`.
### serviceAccountKey
- The application requires `serviceAccountKey` provided by Firebase. The key is distinct from one app to the other. You will need to create your own key at your Firebase console.
- Create `key` folder in the root path and paste your downloaded key from Firebase console into `key` folder. Rename the JSON file as `serviceAccountKey.json`.
### CSS
- On your root path, type `npm run tailwind`.