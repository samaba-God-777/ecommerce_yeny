import { getDb, getAuth } from '../database/firestore.js'

/**
 * Usuarios sobre Firebase.
 *
 * Reparto de responsabilidades:
 *  - Firebase Auth guarda correo y contrasena, y emite los tokens. La app
 *    nunca ve ni almacena contrasenas.
 *  - Firestore ("users", con el uid de Auth como id) guarda el perfil:
 *    nombre de usuario, telefono, direccion y la fecha de alta.
 *  - "isAdmin" vive como custom claim en Auth, para que el token lo traiga y
 *    no haya que leer Firestore en cada peticion.
 */

const coleccion = () => getDb().collection('users')

function formatUser(doc, claims = {}) {
  if (!doc?.exists) return null
  const { passwordHash, ...datos } = doc.data()
  return { id: doc.id, ...datos, isAdmin: !!claims.isAdmin }
}

export async function createUser({ id, username, email, password, isAdmin = false }) {
  const auth = getAuth()

  // Auth es la fuente de la verdad de las credenciales
  const registro = await auth.createUser({
    ...(id && { uid: id }),
    email,
    password,
    displayName: username
  })

  if (isAdmin) await auth.setCustomUserClaims(registro.uid, { isAdmin: true })

  const perfil = {
    username,
    email,
    isAdmin: !!isAdmin,
    phone: '',
    address: '',
    createdAt: new Date()
  }
  await coleccion().doc(registro.uid).set(perfil)

  return { id: registro.uid, ...perfil }
}

export async function getUserByUsername(username) {
  const snap = await coleccion().where('username', '==', username).limit(1).get()
  if (snap.empty) return null
  return withClaims(snap.docs[0])
}

export async function getUserByEmail(email) {
  const snap = await coleccion().where('email', '==', email).limit(1).get()
  if (snap.empty) return null
  return withClaims(snap.docs[0])
}

export async function getUserById(id) {
  const doc = await coleccion().doc(id).get()
  if (!doc.exists) return null
  return withClaims(doc)
}

async function withClaims(doc) {
  let claims = {}
  try {
    const registro = await getAuth().getUser(doc.id)
    claims = registro.customClaims || {}
  } catch {
    // El perfil existe en Firestore pero no en Auth: se trata como no admin
  }
  return formatUser(doc, claims)
}

export async function getAllUsers() {
  const snap = await coleccion().orderBy('createdAt', 'desc').get()
  return snap.docs.map(d => formatUser(d, { isAdmin: d.data().isAdmin }))
}

export async function updatePassword(id, newPassword) {
  // La contrasena la guarda Auth, no Firestore
  await getAuth().updateUser(id, { password: newPassword })
}

export async function updateProfile(id, data) {
  const updates = {}
  for (const key of ['username', 'email', 'phone', 'address']) {
    if (data[key] !== undefined) updates[key] = data[key]
  }
  if (Object.keys(updates).length > 0) {
    await coleccion().doc(id).update(updates)
    // El correo y el nombre visible tambien viven en Auth
    const enAuth = {}
    if (updates.email) enAuth.email = updates.email
    if (updates.username) enAuth.displayName = updates.username
    if (Object.keys(enAuth).length) await getAuth().updateUser(id, enAuth)
  }
  return getUserById(id)
}

export async function setAdmin(id, esAdmin) {
  await getAuth().setCustomUserClaims(id, { isAdmin: !!esAdmin })
  await coleccion().doc(id).update({ isAdmin: !!esAdmin })
}
