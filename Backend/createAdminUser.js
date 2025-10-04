const { admin } = require('./firebaseConfig');

const email = 'cyberlord700@gmail.com';
const password = 'adminabhi';

admin.auth().createUser({
  email: email,
  password: password,
  emailVerified: true,
  disabled: false
})
.then((userRecord) => {
  // See the UserRecord reference doc for the contents of userRecord.
  console.log('Successfully created new user:', userRecord.uid);
  return admin.auth().setCustomUserClaims(userRecord.uid, { role: 'admin' });
})
.then(() => {
  console.log('Successfully set custom claim for admin role.');
  process.exit();
})
.catch((error) => {
  console.log('Error creating new user:', error);
  process.exit(1);
});
