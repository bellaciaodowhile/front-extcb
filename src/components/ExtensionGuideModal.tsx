import React, { useState } from 'react';
import { X, Puzzle, CheckCircle2, Copy, Check, Terminal, FolderOpen, Layers, ShieldCheck, Download } from 'lucide-react';

interface ExtensionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExtensionGuideModal: React.FC<ExtensionGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Fredoka',sans-serif]">
                Instalación como Extensión de Google Chrome
              </h2>
              <p className="text-xs text-slate-400">Guía para desarrolladores y carga en Modo de Desarrollador</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-200 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-2 text-sm font-['Fredoka',sans-serif]">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                Compilar el proyecto localmente
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Ejecuta el comando de compilación en tu terminal para generar la carpeta <code className="text-cyan-300 font-mono">dist</code> con los recursos estáticos y los scripts de la extensión.
            </p>
            <div className="relative mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <code>npm run build</code>
              <button
                onClick={() => copyToClipboard('npm run build', 1)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Copiar comando"
              >
                {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-cyan-400 flex items-center gap-2 text-sm font-['Fredoka',sans-serif]">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
              Abrir Gestión de Extensiones en Google Chrome
            </span>
            <p className="text-slate-400 text-xs">
              Abre una nueva pestaña en Google Chrome e ingresa a la siguiente URL en la barra de direcciones:
            </p>
            <div className="relative mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <code>chrome://extensions/</code>
              <button
                onClick={() => copyToClipboard('chrome://extensions/', 2)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                title="Copiar URL"
              >
                {copiedIndex === 2 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 flex items-center gap-2 text-sm font-['Fredoka',sans-serif]">
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs font-black">3</span>
              Activar el &quot;Modo de desarrollador&quot;
            </span>
            <p className="text-slate-400 text-xs">
              En la esquina superior derecha de la página <code className="text-cyan-300">chrome://extensions</code>, activa el interruptor <strong className="text-white">&quot;Modo de desarrollador&quot; (Developer Mode)</strong>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 flex items-center gap-2 text-sm font-['Fredoka',sans-serif]">
              <span className="w-5 h-5 rounded-full bg-purple-400 text-slate-950 flex items-center justify-center text-xs font-black">4</span>
              Cargar extensión descomprimida
            </span>
            <p className="text-slate-400 text-xs">
              Haz clic en el botón <strong className="text-white">&quot;Cargar descomprimida&quot; (Load unpacked)</strong> en la esquina superior izquierda y selecciona la carpeta <code className="text-amber-300 font-mono">dist</code> de este proyecto.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-yellow-300 flex items-center gap-2 text-sm font-['Fredoka',sans-serif]">
              <ShieldCheck className="w-5 h-5 text-yellow-400" />
              ¿Cómo funciona la actualización automática cada 2s?
            </span>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-1">
              <li>El script de contenido (<code className="text-cyan-300">content.js</code>) monitorea la página cada 2 segundos buscando <code className="text-amber-300">&lt;p id=&quot;GridResultados&quot;&gt;</code> o la tabla <code className="text-amber-300">#table-5-column</code>.</li>
              <li>Al detectar cambios en las filas, actualiza <code className="text-cyan-300">chrome.storage.local</code> de inmediato.</li>
              <li>La interfaz muestra el podio animado, sonidos sutiles al cambiar puestos o completarse y actualiza las estadísticas en tiempo real sin recargar la página.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-md"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
