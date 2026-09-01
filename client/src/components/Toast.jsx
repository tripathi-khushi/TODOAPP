import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={16} className="toast-icon success" />,
    error: <AlertCircle size={16} className="toast-icon error" />,
    info: <Info size={16} className="toast-icon info" />,
  };

  return (
    <div className={`toast-notification toast-${toast.type || 'info'}`}>
      {icons[toast.type || 'info']}
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close-btn" onClick={onDismiss}>
        <X size={13} />
      </button>
    </div>
  );
};
export default Toast;
