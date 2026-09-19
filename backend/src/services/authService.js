import { getAuth } from '../database/firestore.js'
import { createUser, getUserById, getUserByUsername, updateProfile, getAllUsers, setAdmin } from '../models/userModel.js'

/**
 * Autenticacion sobre Firebase Auth.
 *
 * El alta y el inicio de sesion ocurren en el cliente con el SDK de Firebase;
 * el backend solo verifica el token (middleware/auth.js) y mantiene el perfil
 * en Firestore. Aqui no se manejan contrasenas ni se emiten tokens.
 */

/**
 * Crea el perfil en Firestore la primera vez que entra una cuenta de Auth.
 *
 * Se llama despues de registrarse en el cliente: Auth ya tiene la cuenta, pero
 * Firestore todavia no tiene el nombre de usuario ni el resto del perfil.
 */
export async function ensureProfile(uid, { username, email } = {}) {
  const existente = await getUserById(uid)
  if (existente) return { success: true, user: existente, creado: false }

  const registro = await getAuth().getUser(uid)
  const nombre = username || registro.displayName || (registro.email || '').split('@')[0]

  // Dos cuentas con el mismo nombre visible confundirian al panel
  if (await getUserByUsername(nombre)) {
    return { success: false, error: 'Ese nombre de usuario ya está en uso' }
  }

  const user = await createUserProfile(uid, {
    username: nombre,
    email: email || registro.email
  })
  return { success: true, user, creado: true }
}

async function createUserProfile(uid, { username, email }) {
  const { getDb } = await import('../database/firestore.js')
  const perfil = {
    username,
    email,
    isAdmin: false,
    phone: '',
    address: '',
    createdAt: new Date()
  }
  await getDb().collection('users').doc(uid).set(perfil)
  return { id: uid, ...perfil }
}

/** Alta completa desde el servidor: solo la usa el seed. */
export async function registerUser(username, email, password, isAdmin = false) {
  if (await getUserByUsername(username)) {
    return { success: false, error: 'El usuario ya existe' }
  }
  const user = await createUser({ username, email, password, isAdmin })
  return { success: true, user }
}

export { getUserById, updateProfile, getAllUsers, setAdmin }
