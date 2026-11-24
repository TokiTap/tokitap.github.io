# Sitio web de Toki

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni base de datos). Funciona en cualquier hosting.

## Antes de publicar

Abre `js/config.js` y reemplaza todo lo que diga **PENDIENTE**:

| Campo | Ejemplo |
|---|---|
| `whatsapp` | `524431234567` (52 + 10 dígitos, sin espacios) |
| `email` | `hola@tokinfc.com` |
| `instagram`, `facebook`, `tiktok` | enlaces completos a los perfiles |
| `horario` | `Lunes a sábado · 10:00 a 19:00` |

Mientras un dato diga PENDIENTE, el sitio lo oculta solo: sin WhatsApp no se muestra el botón flotante, sin redes no salen los íconos y, si no hay ni WhatsApp ni correo, el formulario se cambia por un aviso de "Muy pronto". En cuanto llenen el dato, aparece sin tocar nada más.

Los precios están en `index.html`, en la sección `<!-- PLANES -->`. Mini web y Menú digital dicen "Cotiza" hasta que definan su precio.

## Estructura

```
index.html        Página principal
css/styles.css    Estilos e identidad (colores en :root)
js/config.js      Datos de contacto (lo único que hay que editar)
js/main.js        Menú móvil, enlaces de WhatsApp y formulario
assets/           Logo en versión oscura y clara
favicon.svg       Ícono de la pestaña
```

## Cómo subirlo

- **Netlify (gratis, lo más rápido):** entra a app.netlify.com/drop y arrastra la carpeta completa.
- **GitHub Pages (gratis):** sube la carpeta a un repositorio y activa Pages en Settings → Pages.
- **Hosting con cPanel (Hostinger, etc.):** sube el contenido de la carpeta a `public_html`.

Después conecta su dominio desde el panel del hosting.

## Notas

- El formulario no necesita servidor: arma el mensaje y abre WhatsApp con el texto listo.
- La tipografía (Poppins) se carga de Google Fonts.
- Los colores de la marca están como variables al inicio de `css/styles.css`.
