# Web de Reto a Dos

Web estática y responsive de **Reto a Dos — Libros para jugar cara a cara**, una colección de Nora Montalba.

Incluye una sección de pedidos profesionales para colegios, librerías, residencias, centros de día, asociaciones y centros educativos. Permite seleccionar de 0 a 10 unidades de cada uno de los ocho títulos, preparar un pedido combinado de 6 o más ejemplares y abrir Gmail con un correo dirigido a Nora Montalba, el formulario y el resumen ya completados. También permite copiar la solicitud para utilizar cualquier otro correo. La solicitud no se envía automáticamente.

## Abrir la web

Abre `index.html` en cualquier navegador. Para publicarla, sube `index.html` y la carpeta `assets` manteniendo la misma estructura.

## SEO y publicación

La web ya incorpora título y descripción optimizados, estructura semántica, textos alternativos, carga prioritaria de la imagen principal, datos estructurados de la colección y los libros, enlace canónico para `https://retoados.com/`, `robots.txt` y `sitemap.xml`.

Después de publicar, conviene enviar `https://retoados.com/sitemap.xml` a Google Search Console.

## Google Analytics, Tag Manager y cookies

Google Tag Manager está configurado con el contenedor `GTM-TZGV3L59`, pero no se carga hasta que el visitante acepta las cookies analíticas. La preferencia se conserva durante 12 meses y puede modificarse desde el enlace «Gestionar cookies» del pie de página.

Para empezar a registrar visitas, el contenedor debe incluir una etiqueta de Google Analytics 4 con su identificador de medición y estar publicado desde Google Tag Manager.

La página `privacidad.html` reúne la política de privacidad y cookies. Antes de la publicación comercial definitiva conviene revisar si deben añadirse los datos legales completos del titular —nombre o razón social, NIF y domicilio— en función de quién edite y explote la colección.

## Añadir o modificar libros

Los ocho libros se encuentran en la sección `book-grid` de `index.html`. Cada ficha usa atributos `data-title`, `data-subtitle`, `data-description`, `data-audience` y `data-theme`; el mismo cuadro emergente muestra automáticamente la información del libro seleccionado y adopta su color temático.

Para añadir otro título, duplica uno de los botones con clase `book`, cambia sus textos y asigna un valor `data-theme` con sus variables de color en `assets/css/styles.css`. Los títulos con portada usan además la clase `book-has-cover` y el atributo `data-cover`. Si el libro dispone de portadilla interior, añádela en formato WebP mediante `data-inside` y describe la imagen con `data-inside-alt`.

## Portadillas interiores y muestras PDF

Las fichas de Animales, Mitología, Deportes y Cine muestran una miniatura de su portadilla interior. Al pulsarla se abre un visor ampliado. Las versiones web están en `assets/images` y terminan en `portadilla.webp`.

Cada ficha incluye también un botón reservado para una muestra gratuita. Mientras no exista un PDF, aparece desactivado como «Muestra PDF · próximamente». Para activarlo, guarda el archivo en `assets/pdfs` y añade al botón del libro el atributo `data-sample` con su ruta, por ejemplo:

`data-sample="assets/pdfs/muestra-duelo-animales.pdf"`

El botón cambiará automáticamente a «Descargar muestra gratuita (PDF)» y descargará el archivo.

## Añadir los enlaces de Amazon

En `index.html`, sustituye `#amazon-pendiente` por la dirección de Amazon correspondiente. Mientras se mantenga ese marcador, la web mostrará un aviso indicando que el enlace todavía está pendiente.

## Correo de contacto

El correo configurado para la autora, los centros y el pie de página es `noramontalbaretoados@gmail.com`.

## Instrucción de la barrera

La web explica que deben levantarse tres hojas juntas y mantenerse rectas con una pinza grande o con una mano. Si se modifica la mecánica del libro, actualiza tanto la sección “Así funciona” como la pregunta frecuente correspondiente.

## Sustituir fotografías

Las imágenes están en `assets/images`, optimizadas en formato WebP. Puedes reemplazar cualquier archivo manteniendo su nombre para que la web se actualice sin tocar el código.

Las portadas visibles son `duelodemunicipiosdeespana.webp`, `duelodeanimales.webp`, `duelodemitologia.webp`, `duelodedeportes.webp`, `duelodegruposmusicales.webp`, `duelodecine.webp`, `duelodegeografiadeespana.webp` y `duelodeciudadesdelmundo.webp`. Todas aparecen ampliadas dentro de la ficha completa de cada libro.

En ordenadores con ratón, las tarjetas incorporan una inclinación y un resplandor temático muy suaves. El efecto se desactiva automáticamente en pantallas táctiles y cuando el navegador solicita reducir el movimiento.

El retrato de la autora utiliza el archivo `nora-montalba.webp`.

La nota completa de Nora se abre desde la tarjeta editorial situada después de la introducción o desde el botón incluido en su sección. El texto está dentro del cuadro `author-note-dialog` de `index.html`.

## Archivos principales

- `index.html`: contenido, libros, casos de uso y fichas.
- `assets/css/styles.css`: diseño completo y adaptación móvil.
- `assets/js/main.js`: menú, animaciones, fichas de los libros y avisos de Amazon.

La carpeta `.openai` no forma parte del paquete descargable.
