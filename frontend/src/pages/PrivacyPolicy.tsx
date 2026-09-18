import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
          <Shield size={32} className="text-pink-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-brown">Política de Privacidad</h1>
        <p className="mt-3 text-sm text-brown/50">Última actualización: 29 de junio de 2026</p>
        <p className="mt-2 text-sm text-brown/50">Yenyleths Boutique — Todos los derechos reservados</p>
      </div>

      <div className="prose prose-brown max-w-none space-y-10 text-sm leading-relaxed text-brown/80">

        {/* 1. Identificación del Responsable */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <FileText size={20} className="text-pink-500" />
            1. Identificación del Responsable del Tratamiento
          </h2>
          <p className="mt-3">
            En cumplimiento de la Ley Orgánica de Protección de Datos Personales y de los Derechos Digitales (LOPDDBGDD), 
            le informamos que los datos personales recopilados a través de este sitio web son tratados por:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Razón Social:</strong> Yenyleths Boutique</li>
            <li><strong>Actividad:</strong> Comercio electrónico de productos de moda y accesorios</li>
            <li><strong>Correo Electrónico de Contacto:</strong> privacidad@yenyleths.com</li>
            <li><strong>Plataforma:</strong> Sitio web yenyleths.com</li>
          </ul>
        </section>

        {/* 2. Finalidad */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Eye size={20} className="text-pink-500" />
            2. Finalidad del Tratamiento de Datos
          </h2>
          <p className="mt-3">
            Sus datos personales serán tratados con las siguientes finalidades, según corresponda:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li>Gestión de pedidos, pagos y envíos de productos adquiridos.</li>
            <li>Creación y mantenimiento de su cuenta de usuario.</li>
            <li>Atención al cliente y resolución de consultas, quejas o reclamaciones.</li>
            <li>Envío de comunicaciones comerciales sobre ofertas, promociones y novedades, previo consentimiento expreso.</li>
            <li>Elaboración de estadísticas y análisis de uso del sitio web para mejorar nuestros servicios.</li>
            <li>Cumplimiento de obligaciones legales y fiscales.</li>
            <li>Prevención del fraude y garantía de la seguridad de las transacciones.</li>
          </ul>
        </section>

        {/* 3. Base Legal */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Lock size={20} className="text-pink-500" />
            3. Base Legal del Tratamiento
          </h2>
          <p className="mt-3">
            El tratamiento de sus datos se fundamenta en:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Ejecución de contrato:</strong> Cuando los datos son necesarios para procesar su compra y prestar los servicios solicitados (Art. 6.1.b RGPD).</li>
            <li><strong>Consentimiento:</strong> Cuando usted nos autoriza expresamente a enviar comunicaciones comerciales o a utilizar cookies no esenciales (Art. 6.1.a RGPD).</li>
            <li><strong>Interés legítimo:</strong> Para la prevención del fraude, la mejora de nuestros servicios y el envío de comunicaciones sobre productos similares a los ya adquiridos (Art. 6.1.f RGPD).</li>
            <li><strong>Obligación legal:</strong> Para el cumplimiento de obligaciones tributarias, contables y de conservación de datos (Art. 6.1.c RGPD).</li>
          </ul>
        </section>

        {/* 4. Datos Recopilados */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Database size={20} className="text-pink-500" />
            4. Datos Personales Recopilados
          </h2>
          <p className="mt-3">
            Podemos recopilar y tratar las siguientes categorías de datos personales:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Datos de identificación:</strong> nombre, apellidos, dirección de correo electrónico, número de teléfono.</li>
            <li><strong>Datos de facturación:</strong> dirección de facturación, número de identificación fiscal (cuando aplique).</li>
            <li><strong>Datos de envío:</strong> dirección de entrega, código postal, localidad, provincia.</li>
            <li><strong>Datos de pago:</strong> información de tarjeta de crédito/débito (procesada exclusivamente por pasarelas de pago certificadas; no almacenamos estos datos).</li>
            <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia, cookies.</li>
            <li><strong>Datos de opiniones:</strong> reseñas y comentarios que usted voluntariamente publique.</li>
          </ul>
        </section>

        {/* 5. Conservación */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Eye size={20} className="text-pink-500" />
            5. Plazo de Conservación de los Datos
          </h2>
          <p className="mt-3">
            Sus datos personales serán conservados durante los siguientes plazos:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Datos de cuenta:</strong> mientras mantenga su cuenta activa, y hasta 3 años desde el último acceso.</li>
            <li><strong>Datos de pedidos:</strong> durante la ejecución del contrato y hasta 5 años para obligaciones fiscales y contables.</li>
            <li><strong>Datos de marketing:</strong> hasta que retire su consentimiento.</li>
            <li><strong>Cookies:</strong> según la política de cookies específica de este sitio web.</li>
            <li><strong>Datos de opiniones:</strong> mientras no solicite su eliminación.</li>
          </ul>
        </section>

        {/* 6. Seguridad */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Lock size={20} className="text-pink-500" />
            6. Medidas de Seguridad
          </h2>
          <p className="mt-3">
            Yenyleths Boutique ha implementado las medidas técnicas y organizativas necesarias para garantizar la seguridad 
            de sus datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta 
            el estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos, de 
            conformidad con el artículo 32 del RGPD y el artículo 68 de la LOPDDBGDD.
          </p>
          <p className="mt-3">
            Entre otras medidas, se han adoptado:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li>Cifrado SSL/TLS en todas las comunicaciones.</li>
            <li>Control de acceso restringido a los datos personales.</li>
            <li>Sistemas de detección y prevención de intrusos.</li>
            <li>Copias de seguridad periódicas.</li>
            <li>Procesamiento seguro de pagos a través de pasarelas certificadas PCI DSS.</li>
          </ul>
        </section>

        {/* 7. Derechos */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Shield size={20} className="text-pink-500" />
            7. Ejercicio de Derechos
          </h2>
          <p className="mt-3">
            De conformidad con el RGPD y la LOPDDBGDD, usted tiene derecho a:
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Acceso:</strong> obtener confirmación de si estamos tratando sus datos y, en su caso, acceso a los mismos.</li>
            <li><strong>Rectificación:</strong> solicitar la corrección de datos inexactos o incompletos.</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos para fines específicos.</li>
            <li><strong>Limitación:</strong> solicitar la limitación del tratamiento en determinadas circunstancias.</li>
            <li><strong>Portabilidad:</strong> recibir sus datos en un formato estructurado, de uso común y lectura mecánica.</li>
            <li><strong>Revocación del consentimiento:</strong> retirar el consentimiento en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior.</li>
          </ul>
          <p className="mt-3">
            Para ejercer sus derechos, puede enviarnos un correo electrónico a{' '}
            <a href="mailto:privacidad@yenyleths.com" className="text-pink-600 underline">privacidad@yenyleths.com</a>{' '}
            adjuntando copia de su documento de identidad. Responderemos en un plazo máximo de 30 días.
          </p>
        </section>

        {/* 8. Comunicaciones Comerciales */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Mail size={20} className="text-pink-500" />
            8. Comunicaciones Comerciales
          </h2>
          <p className="mt-3">
            Solo recibirá comunicaciones comerciales si ha dado su consentimiento expreso para ello. 
            Puede darse de baja en cualquier momento haciendo clic en el enlace de "Cancelar suscripción" 
            que encontrará en el pie de nuestros correos electrónicos, o solicitándolo a través de{' '}
            <a href="mailto:privacidad@yenyleths.com" className="text-pink-600 underline">privacidad@yenyleths.com</a>.
          </p>
        </section>

        {/* 9. Cookies */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Eye size={20} className="text-pink-500" />
            9. Política de Cookies
          </h2>
          <p className="mt-3">
            Este sitio web utiliza cookies propias y de terceros para mejorar su experiencia de navegación, 
            analizar el tráfico del sitio y personalizar el contenido. Puede configurar o rechazar las cookies 
            en cualquier momento a través de nuestro panel de preferencias de cookies o modificando la configuración 
            de su navegador. Para más información, consulte nuestra Política de Cookies.
          </p>
        </section>

        {/* 10. Menores */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Shield size={20} className="text-pink-500" />
            10. Menores de Edad
          </h2>
          <p className="mt-3">
            Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos intencionadamente datos personales 
            de menores. Si usted es padre o tutor y tiene conocimiento de que su hijo nos ha proporcionado datos personales, 
            por comuníquelo a{' '}
            <a href="mailto:privacidad@yenyleths.com" className="text-pink-600 underline">privacidad@yenyleths.com</a>{' '}
            para proceder a su eliminación.
          </p>
        </section>

        {/* 11. Transferencias */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Database size={20} className="text-pink-500" />
            11. Transferencias Internacionales de Datos
          </h2>
          <p className="mt-3">
            Sus datos podrán ser transferidos a terceros países únicamente cuando existan garantías adecuadas, 
            como Decisiones de Adequación, Cláusulas Contractuales Tipo o Certificaciones de Privacidad, 
            de conformidad con el Capítulo V del RGPD.
          </p>
        </section>

        {/* 12. Modificaciones */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <FileText size={20} className="text-pink-500" />
            12. Modificaciones de esta Política
          </h2>
          <p className="mt-3">
            Nos reservamos el derecho a modificar la presente Política de Privacidad para adaptarla a 
            novedades legislativas, jurisprudenciales o por cualquier otra razón legítima. Cualquier 
            modificación será publicada en esta página con la fecha de última actualización. Le recomendamos 
            revisar esta Política periódicamente.
          </p>
        </section>

        {/* 13. Reclamaciones */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <Shield size={20} className="text-pink-500" />
            13. Reclamaciones ante la Autoridad de Control
          </h2>
          <p className="mt-3">
            Si considera que el tratamiento de sus datos personales vulnera la normativa vigente, 
            tiene derecho a presentar una reclamación ante la Autoridad de Control competente. 
            En España, la autoridad de control es la Agencia Española de Protección de Datos (AEPD):
          </p>
          <ul className="mt-3 list-inside list-disc space-y-1 pl-4">
            <li><strong>Sitio web:</strong> <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">www.aepd.es</a></li>
            <li><strong>Dirección:</strong> C/ Jorge Juan, 6, 28001 Madrid</li>
            <li><strong>Teléfono:</strong> 901 100 099 / 912 663 517</li>
          </ul>
        </section>

        {/* 14. Legislación Aplicable */}
        <section>
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-brown">
            <FileText size={20} className="text-pink-500" />
            14. Legislación Aplicable y Jurisdicción
          </h2>
          <p className="mt-3">
            La presente Política de Privacidad se rige por la legislación española y europea aplicable, 
            incluyendo el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, 
            de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales 
            (LOPDDBGDD). Para la resolución de cualquier controversia derivada de la presente Política, 
            las partes se someten a la jurisdicción de los Juzgados y Tribunales del domicilio del responsable 
            del tratamiento, con renuncia expresa a cualquier otro fuero que pudiera corresponder.
          </p>
        </section>

        {/* Contacto */}
        <section className="rounded-2xl bg-pink-50 p-6">
          <h2 className="font-serif text-xl font-semibold text-brown">Contacto</h2>
          <p className="mt-3">
            Si tiene cualquier duda sobre esta Política de Privacidad o desea ejercer sus derechos, 
            puede contactarnos a través de:
          </p>
          <ul className="mt-3 space-y-1">
            <li>📧 <a href="mailto:privacidad@yenyleths.com" className="text-pink-600 underline">privacidad@yenyleths.com</a></li>
            <li>📍 Yenyleths Boutique — Comercio electrónico</li>
          </ul>
        </section>
      </div>

      {/* Volver */}
      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-block rounded-full bg-pink-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-pink-600"
        >
          Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
