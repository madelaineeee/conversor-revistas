FROM python:3.11-slim

WORKDIR /app

# Instalar pandoc desde el sistema (más liviano que pypandoc_binary)
RUN apt-get update && \
    apt-get install -y --no-install-recommends pandoc && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python (excluir pypandoc_binary, ya tenemos pandoc del sistema)
COPY requirements.txt .
RUN grep -v pypandoc_binary requirements.txt > /tmp/req.txt && \
    pip install --no-cache-dir -r /tmp/req.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
