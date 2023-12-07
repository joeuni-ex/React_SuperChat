import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGEING_SENDERID,
  appId: import.meta.env.VITE_APPID,
};

//fire base 초기화
const app = initializeApp(firebaseConfig);

//구글 인증 객체
const googleAuth = new GoogleAuthProvider();

//fire store db 사용
const db = getFirestore();

//파이어 베이스 인증객체
const auth = getAuth();

export { auth, googleAuth, db };
