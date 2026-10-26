# Reto a Dos — web completa

Versión optimizada: 19 de octubre de 2026.

## Publicación

Sube **todo el contenido de esta carpeta** a la raíz de GitHub Pages del dominio retoados.com, conservando carpetas y nombres. La web es estática; no necesita servidor de aplicaciones ni base de datos.

La portada de entrada es **index.html**. Incluye las carpetas **assets/** y **libros/**, así como **sitemap.xml**, **robots.txt**, **privacidad.html** y **CNAME**.

## Cambios de esta versión

- Catálogo visible poco después de entrar, con filtros por temática y próximamente.
- Doce fichas completas para libros, en **libros/**, indexables y compartibles individualmente.
- Portadas definitivas de **Recuerdos** y **Ciencia e Inventos** y enlaces Amazon actualizados.
- Ficha de "Nuevos duelos" conservada como próximo lanzamiento de la colección.
- Fotografías de los dos mayores y Nora ajustadas a pantalla móvil sin estiramiento.
- Bloques amarillos equilibrados con un bloque azul oscuro.
- Fichas del catálogo alineadas y accesos separados a Amazon, información y pedidos profesionales.
- Sitemap, metadatos y datos estructurados actualizados para los doce libros.
- Mediciones de clics hacia Amazon y descargas PDF únicamente con consentimiento de cookies analíticas.

## Mantenimiento

- Para actualizar una ficha de un libro, revisa la página correspondiente de **libros/** y sus datos en **index.html**.
- El enlace de **Duelo de Recuerdos** es https://www.amazon.es/dp/B0HNMJ6XWS; Amazon puede tardar en activarlo después de KDP.
- El enlace de **Duelo de Ciencia e Inventos** es https://www.amazon.es/dp/B0HNM78Z24.
- El bloque “Próximamente” seguirá mostrando nuevos títulos, incluso si todos los libros disponibles ya tienen enlace.
- Las fotografías originales están dimensionadas mediante CSS con recorte proporcional, sin deformación.
- Después de publicar, comprueba que **https://retoados.com/sitemap.xml** carga correctamente y registra este sitemap en Google Search Console, si aún no lo has hecho.

**Importante:** Los enlaces a Amazon apuntan a los ASIN indicados, pero la aparición efectiva de la ficha depende de Amazon/KDP.


## Actualización de prefichas y portadillas (20-10-2026)

- En la preficha del catálogo, la cubierta queda visible en la columna izquierda mientras se desplaza el texto en pantallas de escritorio. En móvil el desplazamiento es normal.
- «Ver ficha completa de este libro» conduce a la página individual, y «Cómo se juega a este libro» conduce directamente a la sección correspondiente de esa misma página.
- Las doce páginas individuales reproducen los cuatro pasos y la guía visual original de la página principal.
- La portadilla de Recuerdos se encuentra en `assets/images/dueloderecuerdosportadilla.webp`.
- **IMPORTANTE**: `assets/images/duelodecienciaeinventosportadilla.webp` es provisional y contiene visualmente el título de Recuerdos. Se instala así a petición del propietario. Reemplázala por la imagen correcta de Ciencia e Inventos cuando la tengas, conservando el nombre del archivo, y actualiza la caché del navegador si procede.
- La imagen de la colección tiene encuadre proporcional y el titular termina en «Cambia el tema. El duelo sigue.».
- Todavía no se han añadido páginas interiores inventadas de los juegos.


## Ajustes finales de portada y menú (20-10-2026)

- El recuadro amarillo «Para compartir» ahora dice «Momentos juntos, partida a partida.», sin enlace duplicado.
- El recuadro blanco «La idea» conserva «Un libro. Dos lados. La misma partida.» y su único enlace «Descubre el sistema» a «Cómo se juega».
- Navegación reordenada según las secciones reales: Colección, Cómo se juega, Dónde jugar, Para centros, Pedidos profesionales, La autora, Preguntas. «Ver los libros» continúa siendo el botón destacado final.
- Pulsar el logotipo «Reto a Dos» lleva siempre al comienzo; también cierra el menú móvil.
- Las fichas, imágenes, precios y páginas individuales no se han cambiado.

## Fotografías reales (26/10/2026)

Se incorpora un botón «Ver fotos reales del libro» bajo la fotografía de la sección «Cómo se juega». Abre un visor adaptable con 15 fotografías reales de Duelo de Animales, botones anterior/siguiente, miniaturas, teclado y gesto de deslizar en móvil. Fotos completas en `assets/images/real/` y miniaturas optimizadas en `assets/images/real/miniaturas/`, todas en WebP. El contenido de las fotografías no se ha retocado, generado ni modificado; solo se ha convertido el formato para la web. Para retirar fotografías en el futuro, actualizar el array `photos` de `assets/js/real-gallery.js`.
