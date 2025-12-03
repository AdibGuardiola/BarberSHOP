import { Card, CardHeader, CardTitle, CardContent } from "./Card";

export function LocationsPage() {
  return (
    <>
      {/* SECCIÓN DE SEDES */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sede Triana */}
        <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
          <CardHeader>
            <CardTitle>Sede Triana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-slate-300">
              Calle Mayor de Triana 45 • 35002 • Las Palmas de Gran Canaria
            </p>
            <p className="text-slate-400 text-xs">
              Lunes a viernes: 10:00–14:00 / 16:30–20:30
              <br />
              Sábados: 10:00–14:00
            </p>
            <p className="text-slate-300 text-xs">
              Teléfono: <span className="font-semibold">+34 828 001 122</span>
            </p>
            <p className="text-[11px] text-slate-500">
              En pleno corazón comercial de Triana. Reparaciones rápidas en el día.
            </p>
          </CardContent>
        </Card>

        {/* Sede Mesa y López */}
        <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
          <CardHeader>
            <CardTitle>Sede Mesa y López</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-slate-300">
              Avenida José Mesa y López 82 • 35010 • Las Palmas de G.C.
            </p>
            <p className="text-slate-400 text-xs">
              Lunes a viernes: 9:30–14:00 / 17:00–21:00
            </p>
            <p className="text-slate-300 text-xs">
              Teléfono: <span className="font-semibold">+34 828 333 444</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Zona comercial por excelencia. Servicio express de cambio de pantalla.
            </p>
          </CardContent>
        </Card>

        {/* Sede Siete Palmas */}
        <Card className="bg-slate-800/80 shadow-lg shadow-black/30">
          <CardHeader>
            <CardTitle>Sede Siete Palmas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-slate-300">
              Centro Comercial 7 Palmas • Planta 1 • 35012 • Las Palmas de G.C.
            </p>
            <p className="text-slate-400 text-xs">Lunes a domingo: 10:00–22:00</p>
            <p className="text-slate-300 text-xs">
              Teléfono: <span className="font-semibold">+34 828 555 666</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Perfecto para dejar tu móvil mientras haces compras o deporte.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* SECCIÓN SOBRE MÍ */}
      <section className="mt-12 flex flex-col md:flex-row items-center gap-8 bg-slate-800/40 p-6 rounded-xl shadow-lg shadow-black/30">
        <img
          src="/images/mifoto.jpg"
          alt="Foto personal"
          className="w-40 h-40 rounded-full object-cover shadow-md border border-slate-700"
        />

        <div className="text-slate-200 text-sm md:text-base max-w-2xl">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Sobre mí</h2>

          <p className="mb-3">
            ¡Hola! Soy <strong>Adib Guardiola</strong>, fundador de esta BarberShop
            cerca de la playa de Las Canteras. Siempre he vivido entre el mar, el trato humano
            y el cuidado personal.
          </p>

          <p className="mb-3">
            Con años de experiencia en peluquería y barbería, decidí crear un espacio
            donde se combinan técnica, calidad, ambiente relajado y atención cercana.
          </p>

          <p>
            Gracias por confiar en este proyecto. Será un placer verte en alguna de
            nuestras sedes. 💈✂️
          </p>
        </div>
      </section>
    </>
  );
}
