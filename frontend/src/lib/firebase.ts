import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

/**
 * Firebase en el navegador (solo autenticacion).
 *
 * Los datos NO se leen desde aqui: la tienda sigue hablando con el API, que
 * usa la cuenta de servicio. Firebase se usa para iniciar sesion y obtener el
 * ID token que viaja en cada peticion.
 *
 * Estos valores no son secretos: viajan en el bundle y estan pensados para eso.
 * Lo que protege los datos son las reglas de Firestore y la verificacion del
 * token en el backend.
 */
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(config)
export const auth = getAuth(firebaseApp)

// En desarrollo se puede apuntar al emulador en vez del proyecto real:
// VITE_FIREBASE_AUTH_EMULATOR=http://127.0.0.1:9099
const emulador = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR
if (emulador) {
  connectAuthEmulator(auth, emulador, { disableWarnings: true })
}

/** Mensajes de Firebase traducidos a algo que el cliente entienda. */
export function mensajeDeError(codigo: string): string {
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos'
    case 'auth/invalid-email':
      return 'Ese correo no tiene un formato válido'
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
    case 'auth/network-request-failed':
      return 'No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.'
    case 'auth/user-disabled':
      return 'Esta cuenta está deshabilitada'
    default:
      return 'No pudimos completar la operación. Inténtalo de nuevo.'
  }
}
