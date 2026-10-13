
import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
} from "firebase/auth";
import {
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";

const useEmulators =
  process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === "true";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (useEmulators && projectId !== "demo-cs-master") {
  throw new Error(
    "Firebase emulator mode requires project ID demo-cs-master.",
  );
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp(firebaseConfig);

if (useEmulators && app.options.projectId !== "demo-cs-master") {
  throw new Error(
    "Existing Firebase app is not configured for the demo project.",
  );
}

const auth = getAuth(app);
const db = getFirestore(app);

if (useEmulators) {
  if (typeof window !== "undefined") {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });

    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
}

export { app, auth, db };
