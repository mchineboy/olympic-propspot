import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// What is going on with this.

admin.initializeApp();

export const deleteUser = functions.https.onRequest(async (request, response) => {
  // Set CORS headers for all responses
  response.set('Access-Control-Allow-Origin', 'https://ota-propspot.web.app');
  response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.set('Access-Control-Max-Age', '3600');

  // Handle OPTIONS request for CORS preflight
  if (request.method === 'OPTIONS') {
    response.status(204).send('');
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  const { uid } = request.body;
  const authToken = request.get('Authorization')?.split('Bearer ')[1];

  if (!authToken) {
    response.status(403).send('Unauthorized');
    return;
  }

  if (!uid || typeof uid !== 'string' || uid.length > 128) {
    console.error('Invalid UID received:', uid);
    response.status(400).send('Invalid user ID');
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    
    // Check if the caller is an admin
    const callerProfile = await admin.firestore().collection('profiles').doc(decodedToken.uid).get();
    
    if (!callerProfile.exists || !callerProfile.data()?.administrator) {
      response.status(403).send('Must be an admin to delete users.');
      return;
    }

    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);
    
    // Delete the user's document from Firestore profiles collection
    await admin.firestore().collection('profiles').doc(uid).delete();
    
    response.status(200).send({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    response.status(500).send('Error deleting user');
  }
});