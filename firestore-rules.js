// // Firestore security rules - Copy these to your Firebase console
// Path: Firebase Console > Firestore Database > Rules

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     // Allow anyone to read opportunities
//     match /opportunities/{opportunity} {
//       allow read: if true;
//       // In a real application, you'd want to restrict write access
//       // to authenticated recruiters only, but for simplicity:
//       allow write: if true;
//       // For production, use:
//       // allow write: if request.auth != null && request.auth.token.recruiter == true;
//     }
    
//     // For future use - applications collection
//     match /applications/{application} {
//       allow read: if request.auth != null && 
//         (request.auth.uid == resource.data.userId || request.auth.token.recruiter == true);
//       allow create: if request.auth != null;
//       allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
//     }
//   }
// }