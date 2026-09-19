import readline from 'node:readline'

/**
 * Pide un dato por teclado. Con oculto=true no se ve lo que se escribe, asi
 * una contrasena no queda en pantalla ni en el historial del shell.
 */
export function preguntar(texto, oculto = false) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
  if (oculto) {
    rl._writeToOutput = (s) => rl.output.write(s.includes(texto) ? s : '')
  }
  return new Promise(resolve => {
    rl.question(texto, (r) => {
      rl.close()
      if (oculto) console.log()
      resolve(r.trim())
    })
  })
}
