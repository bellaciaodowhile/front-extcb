import React, { useState } from 'react';
import { X, Code, Check, RefreshCw, Sparkles, FileText, Download } from 'lucide-react';
import { INITIAL_RAW_HTML } from '../utils/htmlParser';

interface HtmlLiveEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentHtml: string;
  onSaveHtml: (newHtml: string) => void;
}

export const HtmlLiveEditorModal: React.FC<HtmlLiveEditorModalProps> = ({
  isOpen,
  onClose,
  currentHtml,
  onSaveHtml,
}) => {
  const [htmlInput, setHtmlInput] = useState(currentHtml);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveHtml(htmlInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const handleResetToDefault = () => {
    setHtmlInput(INITIAL_RAW_HTML);
  };

  const handleAppendSampleRow = (status: 'check' | 'spinner') => {
    const randomId = Math.floor(Math.random() * 90 + 10);
    const names = ['Andrés Gómez', 'Lucía Fernández', 'Mario Duarte', 'Carla Benítez'];
    const sedes = ['PIAR', 'LUGAR1', 'LUGAR2', 'CENTRAL'];
    const chosenName = names[Math.floor(Math.random() * names.length)];
    const chosenSede = sedes[Math.floor(Math.random() * sedes.length)];
    const pts = Math.floor(Math.random() * 40 + 50);
    const corr = Math.floor(Math.random() * 5 + 3);

    const statusHtml =
      status === 'check'
        ? '<div class="green"><i class="ace-icon fa fa-check"></i></div>'
        : '<div><i class="ace-icon fa fa-spinner fa-spin orange"></i></div>';

    const newRow = `
<tr id="row${randomId}">
  <td class="hidden-480">${randomId}</td>
  <td><center><div class="nav ace-nav"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=user${randomId}" class="responsive" width="50" height="30" title="@user${randomId}"></div></center></td>
  <td class="hidden-480"><a href="../Cuestionario/Resultados?UserName=@user${randomId}" target="_blank">${chosenName}</a></td>
  <td class="hidden-480">${chosenSede}</td>
  <td>${corr}</td>
  <td>${pts}</td>
  <td>00:00:${Math.floor(Math.random() * 40 + 20)}.500</td>
  <td>${status === 'check' ? 20 : 12}</td>
  <td>${statusHtml}</td>
</tr>`;

    // Insert before </tbody> or at end
    if (htmlInput.includes('</tbody>')) {
      setHtmlInput(htmlInput.replace('</tbody>', `${newRow}\n</tbody>`));
    } else {
      setHtmlInput(htmlInput + newRow);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border-2 border-cyan-500/50 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-['Fredoka',sans-serif]">
              Fuente HTML de la Tabla (Verificación cada 2s)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            Pega aquí el código HTML completo con la tabla (<code className="text-amber-300">#table-5-column</code> o <code className="text-cyan-300">&lt;p id=&quot;GridResultados&quot;&gt;</code>). El parser procesa automáticamente las columnas: No., Avatar, Usuario, Sede, Correctas, Puntos, Tiempo, Avance y el estado (<span className="text-emerald-400">fa-check</span> = Terminado, <span className="text-amber-400">fa-spinner</span> = En progreso).
          </div>

          {/* Quick Helpers */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleResetToDefault}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Restablecer HTML Inicial
            </button>
            <button
              onClick={() => handleAppendSampleRow('check')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950 border border-emerald-600/50 hover:bg-emerald-900 text-emerald-300 transition-colors flex items-center gap-1"
            >
              + Agregar Fila Terminada (fa-check)
            </button>
            <button
              onClick={() => handleAppendSampleRow('spinner')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-950 border border-amber-600/50 hover:bg-amber-900 text-amber-300 transition-colors flex items-center gap-1"
            >
              + Agregar Fila En Progreso (fa-spinner)
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={12}
            className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 border border-slate-700 text-emerald-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            placeholder="Pega el HTML de la tabla aquí..."
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            {htmlInput.length} caracteres
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> ¡Actualizado!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Procesar y Actualizar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
