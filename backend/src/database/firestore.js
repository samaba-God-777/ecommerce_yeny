import admin from 'firebase-admin'
import logger from '../utils/logger.js'

/**
 * Conexion con Firebase (Firestore + Auth).
 *
 * Credenciales, por orden de preferencia:
 *
 *  1. FIRESTORE_EMULATOR_HOST — desarrollo con el emulador, sin credenciales.
 *  2. FIREBASE_SERVICE_ACCOUNT — el JSON de la cuenta de servicio en una sola
 *     variable (lo comodo en Render: se pega tal cual).
 *  3. GOOGLE_APPLICATION_CREDENTIALS — ruta a ese mismo JSON en disco.
 *
 * La clave privada admite los saltos de linea escapados (\n), porque al pegar
 * el JSON en un panel de variables casi siempre llegan asi.
 */

let app = null
let db = null

function credencialesDelEntorno() {
  const { FIREBASE_SERVICE_ACCOUNT, FIREBASE_PROJECT_ID } = process.env

  if (FIREBASE_SERVICE_ACCOUNT) {
    const cuenta = JSON.parse(FIREBASE_SERVICE_ACCOUNT)
    if (cuenta.private_key) cuenta.private_key = cuenta.private_key.replace(/\\n/g, '\n')
    return { credential: admin.credential.cert(cuenta), projectId: cuenta.project_id }
  }

  // Con emulador o con GOOGLE_APPLICATION_CREDENTIALS basta el id del proyecto
  return { projectId: FIREBASE_PROJECT_ID }
}

export async function connectToFirestore() {
  if (db) return db

  const { credential, projectId } = credencialesDelEntorno()
  if (!projectId && !credential) {
    throw new Error('Falta FIREBASE_SERVICE_ACCOUNT o FIREBASE_PROJECT_ID')
  }

  app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({ ...(credential && { credential }), projectId })

  db = admin.firestore()
  db.settings({ ignoreUndefinedProperties: true })

  // Una lectura de verdad: initializeApp no falla aunque las credenciales
  // esten mal, y sin esto el error aparecería recien en la primera peticion.
  await db.collection('_ping').limit(1).get()

  const donde = process.env.FIRESTORE_EMULATOR_HOST
    ? `emulador ${process.env.FIRESTORE_EMULATOR_HOST}`
    : `proyecto ${projectId}`
  logger.info(`✓ Firestore conectado: ${donde}`)
  return db
}

export function getDb() {
  if (!db) throw new Error('Firestore no inicializado. Llama a connectToFirestore() primero.')
  return db
}

export function getAuth() {
  if (!app) throw new Error('Firebase no inicializado. Llama a connectToFirestore() primero.')
  return admin.auth()
}

export async function closeDb() {
  if (app) {
    await app.delete()
    app = null
    db = null
  }
}

export { admin }
export default { connectToFirestore, getDb, getAuth, closeDb }
