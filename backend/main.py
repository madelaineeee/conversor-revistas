"""
Backend FastAPI para Conversor de Artículos
Maneja uploads, conversión y descarga de archivos
"""

from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os
import shutil
import tempfile
import asyncio
from pathlib import Path
import zipfile

from converter import process_article
from styles import CSS_REVISTAS

app = FastAPI(title="Conversor de Artículos API")

# Configurar CORS para permitir requests desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominio exacto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directorio temporal para archivos
TEMP_DIR = Path(tempfile.gettempdir()) / "conversor_revistas"
TEMP_DIR.mkdir(exist_ok=True)


class ConnectionManager:
    """Maneja conexiones WebSocket para progreso en tiempo real"""
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_progress(self, message: str, websocket: WebSocket):
        await websocket.send_json({"type": "progress", "message": message})

    async def send_complete(self, websocket: WebSocket):
        await websocket.send_json({"type": "complete"})

    async def send_error(self, message: str, websocket: WebSocket):
        await websocket.send_json({"type": "error", "message": message})


manager = ConnectionManager()


@app.get("/")
async def root():
    return {
        "message": "API de Conversión de Artículos",
        "version": "1.0",
        "endpoints": {
            "convert": "/convert",
            "revistas": "/revistas",
            "websocket": "/ws"
        }
    }


@app.get("/revistas")
async def get_revistas():
    """Obtiene la lista de revistas disponibles"""
    return {
        "revistas": [
            {"id": "ric", "name": "Revista RIC", "color": "#2B3690"},
            {"id": "id", "name": "Revista I+D", "color": "#4a0e4e"},
            {"id": "prisma", "name": "Revista PRISMA", "color": "#c41e3a"}
        ]
    }


@app.post("/convert")
async def convert_articles(
    revista: str = Form(...),
    files: List[UploadFile] = File(...)
):
    """
    Convierte múltiples archivos Word a HTML
    
    Parameters:
    - revista: ID de la revista (ric, id, prisma)
    - files: Lista de archivos .docx
    
    Returns:
    - ZIP con todos los HTMLs y carpetas de imágenes
    """
    
    if revista not in CSS_REVISTAS:
        return JSONResponse(
            status_code=400,
            content={"error": f"Revista '{revista}' no válida"}
        )
    
    # Crear directorio temporal para este trabajo
    job_id = os.urandom(8).hex()
    job_dir = TEMP_DIR / job_id
    job_dir.mkdir(exist_ok=True)
    
    input_dir = job_dir / "input"
    output_dir = job_dir / "output"
    pandoc_dir = job_dir / "pandoc_results"
    
    input_dir.mkdir()
    output_dir.mkdir()
    pandoc_dir.mkdir()
    
    try:
        # Guardar archivos subidos
        saved_files = []
        for file in files:
            file_path = input_dir / file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            saved_files.append(file_path)
        
        # Procesar cada archivo
        for index, input_file in enumerate(saved_files, start=1):
            process_article(
                str(input_file),
                index,
                str(output_dir),
                str(pandoc_dir),
                revista
            )
        
        # Crear ZIP con todos los resultados
        zip_path = job_dir / "converted_articles.zip"
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(output_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, output_dir)
                    zipf.write(file_path, arcname)
        
        # Devolver el ZIP
        return FileResponse(
            zip_path,
            media_type="application/zip",
            filename=f"articulos_{revista}_convertidos.zip"
        )
    
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )
    
    finally:
        # Limpiar archivos temporales después de 1 hora
        async def cleanup():
            await asyncio.sleep(3600)
            shutil.rmtree(job_dir, ignore_errors=True)
        
        asyncio.create_task(cleanup())


@app.websocket("/ws/{revista}")
async def websocket_endpoint(websocket: WebSocket, revista: str):
    """
    WebSocket para conversión con progreso en tiempo real
    """
    await manager.connect(websocket)
    
    try:
        while True:
            # Recibir archivos y procesar
            data = await websocket.receive_json()
            
            if data.get("action") == "convert":
                # Aquí iría la lógica de conversión con progreso
                await manager.send_progress(
                    "Iniciando conversión...",
                    websocket
                )
                
                # Simular progreso (reemplazar con lógica real)
                await asyncio.sleep(1)
                await manager.send_progress(
                    "Procesando archivos...",
                    websocket
                )
                
                await manager.send_complete(websocket)
    
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/health")
async def health_check():
    """Verifica que Pandoc esté instalado"""
    import subprocess
    try:
        result = subprocess.run(
            ["pandoc", "--version"],
            capture_output=True,
            text=True
        )
        pandoc_installed = result.returncode == 0
        pandoc_version = result.stdout.split('\n')[0] if pandoc_installed else None
    except FileNotFoundError:
        pandoc_installed = False
        pandoc_version = None
    
    return {
        "status": "healthy" if pandoc_installed else "warning",
        "pandoc_installed": pandoc_installed,
        "pandoc_version": pandoc_version,
        "message": "OK" if pandoc_installed else "Pandoc no está instalado"
    }


if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando servidor FastAPI...")
    print("📝 API Docs: http://localhost:8000/docs")
    print("🔗 WebSocket: ws://localhost:8000/ws")
    uvicorn.run(app, host="0.0.0.0", port=8000)