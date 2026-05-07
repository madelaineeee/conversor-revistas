"""
CSS Styles para cada revista
Basado en main.css de RIC con variaciones de color
"""

# CSS Base de RIC
CSS_RIC = """
@charset "UTF-8";
* {
	padding: 0;
	text-indent: 0;
	font-family: Segoe, "Segoe UI", "DejaVu Sans", "Trebuchet MS", Verdana, sans-serif;
}

body{
	text-align: left;
	color: #000000;
	font-size: 15px;
	line-height: 120%;
	font-weight: normal;
}

.revista_tituloarticulo {
	color: #2B3690;
	font-weight: bold;
	font-size: 30px;
	text-align: left;
	line-height: 28px;
}
.revista_autores {
	color: #000000;
	font-weight: bold;
	font-size: 20px;
	text-align: left;
	line-height: 120%;
}
.revista_titulo1 {
	color: #030303;
	font-size: 20px;
	text-align: left;
	font-weight: bold;
	line-height: 120%;
}
.revista_titulo2 {
	color: #000000;
	font-size: 18px;
	font-weight: bold;
	line-height: 120%;
	text-align: left;
}
.revista_titulo3 {
	color: #000000;
	font-weight: bold;
	font-size: 16px;
	text-align: left;
	line-height: 120%;
}

.revista_contenido {
	text-align: left;
	color: #000000;
	font-size: 15px;
	line-height: 120%;
	font-weight: normal;
}
.revista_DOI {
	text-align: left;
	color: #000000;
	font-size: 15px;
	line-height: 120%;
	font-weight: normal;
	border-bottom: 2px solid #868686;
	padding-bottom: 20px;
}
.revista_piefototabla {
	color: #000000;
	font-weight: bold;
	font-size: 14px;
	text-align: center;
}
.revista_imagen-centrar {
	text-align: center;
	display: block;
	width: 100%;
}
.revista_encabezadotabla {
	color: #000000;
	font-style: normal;
	font-weight: bold;
	font-size: 15px;
	text-align: center;
}
.tabla {
	border: 1px solid #C0C0C0;
	border-collapse: collapse;
	padding: 5px;
	color: #000000;
	font-size: 15px;
	line-height: 120%;
	font-weight: normal;
}

.tabla tr:first-child{
	background:#F0F0F0;
}

.tabla th {
	border:1px solid #C0C0C0;
	padding:5px;
	background:#F0F0F0;
}
.tabla td {
	border:1px solid #C0C0C0;
	padding:2.5px;
}
.revista_referencias{
    text-align: justify;
    color: #000000;
    font-size: 15px;
    font-style: italic;
    font-weight: normal;
}

/* Estilos para referencias interactivas */
.ref-link {
    color: #2B3690;
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;
    padding: 2px 4px;
    border-radius: 3px;
    transition: all 0.2s;
    display: inline-block;
}
.ref-link:hover {
    background-color: #e3f2fd;
    text-decoration: underline;
}
.back-link {
    color: #666;
    text-decoration: none;
    font-size: 0.85em;
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.2s;
}
.back-link:hover {
    color: #2B3690;
    text-decoration: underline;
}
.reference-item {
    position: relative;
    padding: 8px 0 8px 10px;
    transition: all 0.3s;
}
.reference-item:target {
    background-color: #fff3cd;
    border-left: 4px solid #ffc107;
    padding-left: 6px;
    animation: highlight 0.5s ease-in-out;
}
@keyframes highlight {
    0%, 100% { background-color: #fff3cd; }
    50% { background-color: #ffe69c; }
}
#back-to-reading {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: linear-gradient(135deg, #2B3690 0%, #1a2360 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    display: none;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
    z-index: 1000;
}
#back-to-reading:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}
#back-to-reading.show {
    display: flex;
}

@media (max-width: 469px) {
	.img_responsive{ 
		width:auto;
		height:auto;
	}
	.revista_tituloarticulo {
		font-size:20px;
	}
}	

@media (min-width:470px) and (max-width:777px) {
	.img_responsive{ 
		width:auto;
		height:auto;
	}
	.revista_tituloarticulo {
		font-size:20px;
	}
}
"""

# CSS para I+D (color morado)
CSS_ID = CSS_RIC.replace("#2B3690", "#4a0e4e").replace(
    "linear-gradient(135deg, #2B3690 0%, #1a2360 100%)",
    "linear-gradient(135deg, #4a0e4e 0%, #2d0830 100%)"
)

# CSS para PRISMA (color rojo)
CSS_PRISMA = CSS_RIC.replace("#2B3690", "#c41e3a").replace(
    "linear-gradient(135deg, #2B3690 0%, #1a2360 100%)",
    "linear-gradient(135deg, #c41e3a 0%, #8b1528 100%)"
)

# Diccionario con todos los CSS
CSS_REVISTAS = {
    'ric': CSS_RIC,
    'id': CSS_ID,
    'prisma': CSS_PRISMA
}

# JavaScript para navegación interactiva de referencias
INTERACTIVE_JS = """
<script>
let scrollHistory = [];

function savePosition(fromId) {
    scrollHistory.push(fromId);
    updateBackButton();
}

function goBack() {
    if (scrollHistory.length > 0) {
        const lastPosition = scrollHistory.pop();
        const element = document.getElementById(lastPosition);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateBackButton();
        }
    }
}

function updateBackButton() {
    const btn = document.getElementById('back-to-reading');
    if (btn) {
        if (scrollHistory.length > 0) {
            btn.classList.add('show');
            btn.textContent = '↑ Volver (' + scrollHistory.length + ')';
        } else {
            btn.classList.remove('show');
        }
    }
}

// Agregar botón al cargar documento
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('back-to-reading')) {
        const backBtn = document.createElement('button');
        backBtn.id = 'back-to-reading';
        backBtn.textContent = '↑ Volver';
        backBtn.onclick = goBack;
        document.body.appendChild(backBtn);
    }
    
    // Agregar smooth scroll a todas las referencias
    document.querySelectorAll('.ref-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});
</script>
"""