import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info': return 'bg-blue-600 hover:bg-blue-700 text-white';
      default: return 'bg-red-600 hover:bg-red-700 text-white';
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600">{message}</p>
        </div>

        <div className="flex space-x-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
