/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.deleteUser = functions.https.onCall(async (data, context) => {
    console.log('Delete user function called');
    console.log('User ID to delete:', data.uid);
    console.log('Caller UID:', context.auth?.uid);
  
    // Check if the caller is an admin
    const callerProfile = await admin.firestore().collection('profiles').doc(context.auth?.uid as string).get();
    console.log('Caller profile:', callerProfile.data());
  
    if (!callerProfile.exists || !callerProfile.data()!.administrator) {
      console.log('Caller is not an admin');
      throw new functions.https.HttpsError('permission-denied', 'Must be an admin to delete users.');
    }
  
    try {
      // Delete the user from Firebase Authentication
      await admin.auth().deleteUser(data.uid);
      console.log('User deleted from Authentication');
      
      // Delete the user's document from Firestore profiles collection
      await admin.firestore().collection('profiles').doc(data.uid).delete();
      console.log('User profile deleted from Firestore');
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new functions.https.HttpsError('internal', 'Error deleting user');
    }
  });