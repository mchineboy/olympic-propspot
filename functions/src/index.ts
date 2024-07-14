import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();

const corsHandler = cors({origin: true});

export const deleteUser = functions.https.onRequest((request, response) => {
  return new Promise((resolve) => {
    corsHandler(request, response, async () => {
      if (request.method !== 'POST') {
        response.status(405).send('Method Not Allowed');
        return resolve();
      }

      const { uid } = request.body;
      const authToken = request.get('Authorization')?.split('Bearer ')[1];

      if (!authToken) {
        response.status(403).send('Unauthorized');
        return resolve();
      }

      try {
        const decodedToken = await admin.auth().verifyIdToken(authToken);
        
        // Check if the caller is an admin
        const callerProfile = await admin.firestore().collection('profiles').doc(decodedToken.uid).get();
        
        if (!callerProfile.exists || !callerProfile.data()?.administrator) {
          response.status(403).send('Must be an admin to delete users.');
          return resolve();
        }

        // Delete the user from Firebase Authentication
        await admin.auth().deleteUser(uid);
        
        // Delete the user's document from Firestore profiles collection
        await admin.firestore().collection('profiles').doc(uid).delete();
        
        response.status(200).send({ success: true });
        return resolve();
      } catch (error) {
        console.error('Error deleting user:', error);
        response.status(500).send('Error deleting user');
        return resolve();
      }
    });
  });
});