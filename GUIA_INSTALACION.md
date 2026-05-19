# Guía de instalación — Conversor de Revistas

Esta guía te lleva paso a paso para instalar y correr la aplicación en tu computadora con Windows. No necesitás saber programación.

---

## Lo que vas a instalar

Solo necesitás instalar **una sola cosa**: Docker Desktop. Él se encarga de todo lo demás (Python, Node.js, Pandoc, etc.) automáticamente.

---

## Paso 1 — Instalar Docker Desktop

1. Abrí tu navegador y andá a:
   **https://www.docker.com/products/docker-desktop**

2. Hacé clic en el botón de descarga para Windows.

3. Cuando termine de descargar, abrí el instalador (doble clic) y seguí los pasos. Dejá todas las opciones por defecto.

4. Al terminar la instalación, **reiniciá tu computadora** si te lo pide.

5. Buscá Docker Desktop en el menú de inicio y ábrilo. Vas a ver una ballena en la barra de tareas abajo a la derecha — esperá hasta que deje de moverse (puede tardar 1 minuto).

> ⚠️ Docker Desktop tiene que estar **abierto y corriendo** cada vez que uses la aplicación.

---

## Paso 2 — Descargar el proyecto

Tenés que elegir una carpeta en tu computadora donde guardar el proyecto. Te recomendamos usar **Documentos** o el **Escritorio**.

### 2.1 — Abrí la terminal

1. Presioná las teclas **Windows + R** al mismo tiempo.
2. Escribí `powershell` y presioná Enter.
3. Se abre una ventana azul o negra — esa es la terminal.

### 2.2 — Navegá a la carpeta donde querés guardar el proyecto

Escribí uno de estos comandos según dónde quieras guardarlo y presioná Enter:

**Si querés guardarlo en Documentos:**
```
cd "$env:USERPROFILE\Documents"
```

**Si querés guardarlo en el Escritorio:**
```
cd "$env:USERPROFILE\Desktop"
```

### 2.3 — Descargá el proyecto

Copiá este comando exactamente, pegalo en la terminal y presioná Enter:

```
git clone https://github.com/madelaineeee/conversor-revistas
```

> ⚠️ Si aparece el mensaje `'git' is not recognized`, instalá Git desde **https://git-scm.com/download/win**, reiniciá la terminal y volvé a intentarlo.

Cuando termine, vas a ver una carpeta llamada `conversor-revistas` en el lugar que elegiste.

---

## Paso 3 — Entrar a la carpeta del proyecto

En la misma terminal, escribí este comando y presioná Enter:

```
cd conversor-revistas
```

Vas a ver que el texto de la terminal ahora muestra `conversor-revistas` — eso significa que estás dentro de la carpeta correcta.

---

## Paso 4 — Iniciar la aplicación

Escribí este comando y presioná Enter:

```
docker compose up --build
```

**La primera vez tarda entre 5 y 10 minutos** — está descargando e instalando todo automáticamente. Vas a ver mucho texto moviéndose, eso es normal.

Cuando aparezcan estas líneas, significa que ya está listo:

```
backend-1  | INFO:     Application startup complete.
backend-1  | INFO:     Uvicorn running on http://0.0.0.0:8000
frontend-1 | start worker process
```

---

## Paso 5 — Abrir la aplicación

Abrí tu navegador (Chrome, Edge, Firefox) y andá a esta dirección:

**http://localhost:3000**

¡Listo! Ya podés usar la aplicación.

---

## Cómo detener la aplicación

En la terminal donde está corriendo, presioná **Ctrl + C**. La aplicación se detiene.

---

## Cómo volver a iniciarla (próximas veces)

Las veces siguientes no necesitás el `--build`. Es mucho más rápido:

1. Asegurate de que **Docker Desktop esté abierto**.
2. Abrí PowerShell (**Windows + R** → escribí `powershell` → Enter).
3. Navegá a la carpeta del proyecto:
   ```
   cd "$env:USERPROFILE\Documents\conversor-revistas"
   ```
   *(cambiá `Documents` por `Desktop` si lo guardaste ahí)*
4. Iniciá la aplicación:
   ```
   docker compose up
   ```
5. Abrí **http://localhost:3000** en el navegador.

---

## Problemas comunes

**"docker is not recognized"**
→ Docker Desktop no está instalado o no está abierto. Buscalo en el menú de inicio, ábrilo y esperá a que cargue.

**"git is not recognized"**
→ Instalá Git desde https://git-scm.com/download/win, cerrá y volvé a abrir la terminal.

**La página no carga en http://localhost:3000**
→ Esperá unos segundos más hasta que aparezcan las líneas de "startup complete" en la terminal.

**La terminal se cerró y la app dejó de funcionar**
→ Es normal, la app corre mientras la terminal está abierta. Volvé al Paso de "Cómo volver a iniciarla".
