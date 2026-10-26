# JoabSystems — Página web

Página oficial de **JoabSystems** (Joab Chavez Romero): catálogo de sistemas, ficha de cada programa, centro de
descargas conectado con GitHub Releases, actualizaciones, nosotros y contacto por WhatsApp.

- Dirección publicada: **https://jcramigofiel20-collab.github.io**
- Hecha con React + TypeScript + Vite + Tailwind CSS + React Router + Motion + Lucide.
- Es un sitio estático: no tiene base de datos ni servidor propio, y no guarda datos de los visitantes.

> Este repositorio contiene **solo la página**. El código de los sistemas (FARMA PRO, etc.), las llaves de
> licencia, los archivos `.env` y las bases de datos **nunca** se suben aquí. Los instaladores se publican en el
> repositorio de descargas de cada sistema (por ejemplo `farma-pro-descargas`).

## Pantallas (cada una con su propia dirección)

| Dirección | Pantalla |
|---|---|
| `/` | Inicio |
| `/sistemas` | Catálogo con buscador y filtros (`?q=`, `?categoria=`, `?estado=`, `?descarga=1`) |
| `/sistemas/farmacia` | Ficha de FARMA PRO |
| `/categorias` | Sistemas por tipo de negocio |
| `/descargas` | Centro de descargas (versión, fecha, tamaño, huella SHA-256, versiones anteriores) |
| `/actualizaciones` | Notas de cada versión, leídas de GitHub |
| `/nosotros` | Información de JoabSystems |
| `/contacto` | WhatsApp, llamada y formulario que arma el mensaje de WhatsApp |

## Comandos

Instalar dependencias (una vez):

```bash
npm install
```

Verla en su PC mientras se edita (abre http://localhost:5173):

```bash
npm run dev
```

Construir la versión final (carpeta `dist`) y verla tal como quedará publicada (http://localhost:4173):

```bash
npm run build
```

```bash
npm run preview
```

## Dónde se cambia cada cosa

| Qué | Archivo |
|---|---|
| Marca, teléfono, correo, **redes sociales** | `src/config/site.ts` |
| **Sistemas del catálogo** | `src/data/systems.ts` |
| Categorías (tipos de negocio) | `src/data/categories.ts` |
| Títulos y descripciones para Google y al compartir | `src/data/seo.ts` |
| Menú lateral | `src/config/navigation.ts` (y la ruta en `src/App.tsx`) |
| Capturas e imágenes | `public/img/<sistema>/` (formato `.webp`) |

**Redes sociales:** pegue el enlace de su perfil en `src/config/site.ts`. Las que quedan vacías no se muestran.

## Agregar un sistema nuevo

1. Copie las capturas a `public/img/<slug>/` (por ejemplo `public/img/gastronex/`).
2. En `src/data/systems.ts`, copie el bloque de FARMA PRO y cambie sus datos. El `slug` es su dirección:
   `slug: 'restaurante'` → `/sistemas/restaurante`.
3. Mientras no tenga instalador publicado use `status: 'en-desarrollo'` (o `'proximamente'`) y **no** ponga
   `download`: la ficha mostrará «En desarrollo · Solicitar información» en lugar de «Descargar».
4. Cuando publique su primera versión en GitHub Releases, ponga `status: 'disponible'` y complete `download`
   (repositorio, nombre exacto del instalador y archivos extra). La versión, la fecha y el tamaño se leen solos de
   GitHub.
5. Suba los cambios (`git add`, `git commit`, `git push`): la página se vuelve a publicar sola en 1 o 2 minutos.

## Publicación (GitHub Pages)

Cada vez que se suben cambios a la rama `main`, GitHub construye y publica la página
(`.github/workflows/deploy.yml`). El avance se ve en la pestaña **Actions** del repositorio.

`npm run build` además crea una página por dirección (para que se puedan abrir y actualizar directo), `404.html`,
`sitemap.xml` y `robots.txt` (`scripts/postbuild.ts`).

## Dominio propio (por ejemplo misistema.com)

1. Compre el dominio (Cloudflare, Namecheap, Porkbun…; para `.pe`, en punto.pe).
2. En el panel del dominio, cree estos registros DNS:
   - Para `misistema.com`: cuatro registros **A** con `185.199.108.153`, `185.199.109.153`, `185.199.110.153` y
     `185.199.111.153`.
   - Para `www.misistema.com`: un registro **CNAME** con `jcramigofiel20-collab.github.io`.
3. En GitHub: repositorio → **Settings → Pages → Custom domain** → escriba `misistema.com` → **Save**. Cuando
   termine la verificación, marque **Enforce HTTPS**.
4. Cree el archivo `public/CNAME` con una sola línea: `misistema.com`.
5. En `.github/workflows/deploy.yml` cambie `VITE_SITE_URL` a `https://misistema.com`, y suba los cambios.

## Panel administrativo (futuro)

Todos los datos pasan por `src/lib/catalog.ts`. Un panel futuro (con inicio de sesión real y permisos) podría guardar
los sistemas en un servicio en línea y solo habría que cambiar ese archivo para leerlos de allí. Nunca ponga
contraseñas ni claves en el código de la página: todo lo que está aquí es público.

## Soporte

Joab Chavez Romero · WhatsApp +51 929 509 865
