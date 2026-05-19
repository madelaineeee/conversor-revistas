import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Download, ExternalLink, X, Pencil, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ConversorRevistasApp = () => {
  const [revistas, setRevistas] = useState([]);
  const [selectedRevista, setSelectedRevista] = useState('');
  const [files, setFiles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [pandocInstalled, setPandocInstalled] = useState(null);

  // Cargar revistas disponibles
  useEffect(() => {
    fetch(`${API_URL}/revistas`)
      .then(res => res.json())
      .then(data => setRevistas(data.revistas))
      .catch(err => console.error('Error cargando revistas:', err));
    
    // Verificar Pandoc
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(data => setPandocInstalled(data.pandoc_installed))
      .catch(err => console.error('Error verificando Pandoc:', err));
  }, []);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...selected.filter(f => !existing.has(f.name))];
    });
    setCompleted(false);
    setError(null);
    setDownloadUrl(null);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.docx'));
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...dropped.filter(f => !existing.has(f.name))];
    });
    setCompleted(false);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingName(files[index].name.replace(/\.docx$/i, ''));
  };

  const saveEdit = (index) => {
    const newName = editingName.trim() || files[index].name;
    const finalName = newName.endsWith('.docx') ? newName : `${newName}.docx`;
    const newFile = new File([files[index]], finalName, { type: files[index].type });
    setFiles(prev => prev.map((f, i) => (i === index ? newFile : f)));
    setEditingIndex(null);
  };

  const handleConvert = async () => {
    if (!selectedRevista) {
      setError('Por favor selecciona una revista');
      return;
    }
    if (files.length === 0) {
      setError('Por favor selecciona al menos un archivo Word');
      return;
    }

    setProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('revista', selectedRevista);
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la conversión');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setCompleted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedRevista('');
    setFiles([]);
    setCompleted(false);
    setError(null);
    setDownloadUrl(null);
  };

  const getRevistaColor = (revistaId) => {
    const revista = revistas.find(r => r.id === revistaId);
    return revista?.color || '#2563eb';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-blue-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Conversor de Artículos
            </h1>
          </div>
          <p className="text-blue-200 text-lg">
            Sistema automatizado de conversión Word → HTML para articulos científicos de las revistas académicas de la <strong>UTP</strong>.
          </p>
        </div>

        {/* Alerta de Pandoc */}
        {pandocInstalled === false && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-300" />
              <div>
                <p className="text-red-200 font-semibold">Pandoc no está instalado</p>
                <p className="text-red-300 text-sm">
                  Descarga e instala Pandoc desde{' '}
                  <a href="https://pandoc.org/installing.html" target="_blank" rel="noopener noreferrer" 
                     className="underline hover:text-white">
                    pandoc.org
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Paso 1: Seleccionar Revista */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Seleccionar Revista
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {revistas.map((revista) => (
                <button
                  key={revista.id}
                  onClick={() => setSelectedRevista(revista.id)}
                  style={{
                    backgroundColor: selectedRevista === revista.id ? revista.color : 'white',
                    borderColor: selectedRevista === revista.id ? revista.color : '#d1d5db',
                    color: selectedRevista === revista.id ? 'white' : '#374151'
                  }}
                  className="p-4 rounded-xl border-2 transition-all transform hover:scale-105 font-semibold"
                >
                  {revista.name}
                </button>
              ))}
            </div>
          </div>

          {/* Paso 2: Cargar Archivos */}
          <div className="p-6 md:p-8 border-b border-gray-200">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Cargar Archivos Word
            </h2>
            
            <div className="mt-6">
              <label 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="mb-2 text-lg font-semibold text-gray-700">
                    Click o arrastra archivos aquí
                  </p>
                  <p className="text-sm text-gray-500">Archivos .docx (Múltiples permitidos)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept=".docx"
                  onChange={handleFileSelect}
                />
              </label>

              {files.length > 0 && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-700 mb-2">
                    {files.length} archivo(s) seleccionado(s):
                  </p>
                  <div className="max-h-52 overflow-y-auto">
                    <ul className="space-y-2">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-sm border border-blue-100">
                          <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          {editingIndex === index ? (
                            <input
                              autoFocus
                              className="flex-1 text-sm border border-blue-300 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-400"
                              value={editingName}
                              onChange={e => setEditingName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveEdit(index);
                                if (e.key === 'Escape') setEditingIndex(null);
                              }}
                            />
                          ) : (
                            <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
                          )}
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                          {editingIndex === index ? (
                            <button
                              onClick={() => saveEdit(index)}
                              title="Guardar nombre"
                              className="flex-shrink-0 p-1 rounded hover:bg-green-100 text-green-600 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => startEdit(index)}
                              title="Renombrar archivo"
                              className="flex-shrink-0 p-1 rounded hover:bg-blue-100 text-blue-400 hover:text-blue-600 transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            title="Eliminar archivo"
                            className="flex-shrink-0 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Paso 3: Convertir */}
          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Iniciar Conversión
            </h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={processing || !selectedRevista || files.length === 0 || pandocInstalled === false}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform ${
                processing || !selectedRevista || files.length === 0 || pandocInstalled === false
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 shadow-lg'
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-6 h-6 animate-spin" />
                  Procesando ({files.length} {files.length === 1 ? 'archivo' : 'archivos'})...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FileText className="w-6 h-6" />
                  Convertir a HTML
                </span>
              )}
            </button>
          </div>

          {/* Success Message */}
          {completed && downloadUrl && (
            <div className="p-6 md:p-8 bg-green-50 border-t border-green-200">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-12 h-12 text-green-500 mr-3" />
                <div>
                  <h3 className="text-2xl font-bold text-green-800">¡Conversión Completada!</h3>
                  <p className="text-green-700 mt-1">
                    {files.length} archivo(s) procesado(s) exitosamente
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <a
                  href={downloadUrl}
                  download={`articulos_${selectedRevista}_convertidos.zip`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Descargar ZIP
                </a>
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Convertir Más Archivos
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-blue-900/30 backdrop-blur rounded-xl p-6 text-white">
          <h4 className="font-semibold mb-3 text-blue-200 text-lg">✨ Características:</h4>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-100">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong>Referencias interactivas:</strong> Click en [1], [2] para ver citas</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong>Botón "Volver":</strong> Regresa al punto de lectura</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong>CSS embebido:</strong> No necesitas archivos externos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span><strong>Ecuaciones automáticas:</strong> Se insertan con MathML</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-700">
            <p className="text-blue-200 text-sm">
              <strong>Nota:</strong> Recuerda actualizar el DOI manualmente después de la conversión
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default ConversorRevistasApp;