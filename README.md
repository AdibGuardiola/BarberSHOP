This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Proyecto BarberSHOP

Aplicación web para barbería/salón con catálogo de servicios, reservas y autenticación.

### Funcionalidades clave
- Carrito persistente en el navegador con resumen de precios y limpieza rápida.
- Agendado de citas que envía la reserva a la colección `orders` de Firebase Firestore.
- Valoración de servicios (1-5 ⭐) almacenada en la colección `ratings` en Firestore.
- Navegación entre catálogo (`services`) y ubicaciones (`locations`) desde la vista principal.
- Redirección a `/login` si se intenta reservar o valorar sin sesión iniciada.

### Estructura rápida
- Página principal: `src/app/page.tsx` reúne catálogo, agenda y sidebar de carrito.
- Componentes de UI: `src/components` (botones, tarjetas, sidebar, mapa de sedes).
- Integración con Firebase: `src/lib/firebase.ts` inicializa Auth y Firestore.

### Configuración de entorno
Define las variables `NEXT_PUBLIC_FIREBASE_*` en un `.env.local` con las credenciales de tu proyecto Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
