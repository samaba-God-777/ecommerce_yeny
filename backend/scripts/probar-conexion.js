/**
 * Prueba una cadena de conexion de MongoDB antes de pegarla en el hosting.
 *
 * Uso (desde backend/):
 *   MONGODB_URI="mongodb+srv://usuario:clave@cluster.xxxx.mongodb.net/" node scripts/probar-conexion.js
 *
 * Dice si conecta, cuantos usuarios y productos ve, y traduce los errores
 * tipicos. Nunca imprime la cadena ni la contrasena.
 */
import { MongoClient } from 'mongodb'
import readline from 'node:readline'

/**
 * Pide un dato por teclado. Con oculto=true no se ve lo que se escribe, asi
 * la contrasena no queda en la pantalla ni en el historial del shell.
 */
function preguntar(texto, oculto = false) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  if (oculto) {
    rl._writeToOutput = (s) => rl.output.write(s.includes(texto) ? s : '')
  }
  return new Promise(resolve => rl.question(texto, (r) => { rl.close(); if (oculto) console.log(); resolve(r.trim()) }))
}

let MONGODB_URI = process.env.MONGODB_URI

// Sin MONGODB_URI se arma a mano: util para probar una contrasena recien
// rotada sin dejarla escrita en ningun archivo.
if (!MONGODB_URI) {
  if (!process.stdin.isTTY) {
    console.error('✗ Falta MONGODB_URI')
    process.exit(1)
  }
  console.log('Sin MONGODB_URI: se arma la cadena aqui mismo.\n')
  const usuario = await preguntar('Usuario de Atlas [admin]: ') || 'admin'
  const clave = await preguntar('Contrasena (no se muestra): ', true)
  const host = await preguntar('Host del cluster [cluster.fk7sg07.mongodb.net]: ') || 'cluster.fk7sg07.mongodb.net'

  if (!clave) {
    console.error('✗ No escribiste contrasena')
    process.exit(1)
  }

  const claveCodificada = encodeURIComponent(clave)
  if (claveCodificada !== clave) {
    console.log('\n⚠ Tu contrasena lleva caracteres que hay que codificar en la URL.')
    console.log('  En Render pega la cadena con la contrasena asi:', claveCodificada)
  }
  MONGODB_URI = `mongodb+srv://${encodeURIComponent(usuario)}:${claveCodificada}@${host}/?appName=Cluster`
  console.log()
}

// Avisa de los caracteres que rompen la cadena si no van codificados
const password = MONGODB_URI.match(/\/\/[^:]+:([^@]*)@/)?.[1] || ''
const problematicos = [...new Set((password.match(/[@#/%:?&]/g) || []))]
if (problematicos.length) {
  console.warn(`⚠ La contrasena contiene ${problematicos.join(' ')} sin codificar.`)
  console.warn('  Equivalentes: @ %40 · # %23 · / %2F · %% %25 · : %3A · ? %3F · & %26\n')
}

// El cliente se construye dentro del try: una cadena mal formada (tipico con
// contrasenas sin codificar) falla aqui, no al conectar.
let client

try {
  client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 15000 })
  await client.connect()
  const db = client.db('yenyleths')
  const usuarios = await db.collection('users').countDocuments()
  const productos = await db.collection('products').countDocuments()

  console.log('✓ Conecta correctamente')
  console.log(`  Base "yenyleths": ${usuarios} usuarios, ${productos} productos`)

  if (usuarios === 0) {
    console.log('  (vacia: falta correr el seed)')
  } else {
    const admins = await db.collection('users')
      .find({ isAdmin: true }, { projection: { username: 1, _id: 0 } }).toArray()
    console.log('  Administradores:', admins.map(a => a.username).join(', ') || '(ninguno)')
  }
} catch (err) {
  const msg = String(err.message).replace(/\/\/[^@\s]*@/g, '//***:***@')
  console.error('✗ No conecta:', msg)

  if (/bad auth|authentication failed/i.test(msg)) {
    console.error('\n  El usuario o la contrasena no coinciden con los de Atlas.')
    console.error('  Revisa Database Access y que la contrasena vaya codificada para URL.')
  } else if (/ENOTFOUND|querySrv/i.test(msg)) {
    console.error('\n  No resuelve el host: revisa el nombre del cluster en la cadena.')
  } else if (/timed out|ETIMEDOUT/i.test(msg)) {
    console.error('\n  Sin respuesta: revisa la lista de IPs en Atlas (Network Access).')
  } else if (/Invalid connection string|MongoParseError/i.test(msg)) {
    console.error('\n  La cadena esta mal formada, casi siempre por caracteres sin')
    console.error('  codificar en la contrasena (ver el aviso de arriba).')
  }
  process.exit(1)
} finally {
  await client?.close()
}
