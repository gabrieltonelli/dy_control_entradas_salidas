import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCcw, X } from 'lucide-react';

const UpdatePrompt = () => {
  const swResult = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  if (!swResult) return null;

  const offlineReadyState = swResult.offlineReady || [false, () => {}];
  const needUpdateState = swResult.needUpdate || [false, () => {}];
  
  const [offlineReady, setOfflineReady] = offlineReadyState;
  const [needUpdate, setNeedUpdate] = needUpdateState;
  const updateServiceWorker = swResult.updateServiceWorker;

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  if (!needUpdate && !offlineReady) return null;

  return (
    <div className="update-prompt-overlay">
      <div className="update-prompt-card glass animate-bounce-in">
        <div className="update-prompt-icon">
          <RefreshCcw size={32} />
        </div>
        <div className="update-prompt-content">
          <h3>{needUpdate ? '¡Nueva versión disponible!' : 'Lista para usar offline'}</h3>
          <p>
            {needUpdate 
              ? 'Se ha descargado una actualización con mejoras y correcciones.' 
              : 'La aplicación se ha guardado para funcionar sin conexión.'}
          </p>
          <div className="update-prompt-actions">
            {needUpdate ? (
              <button 
                className="btn btn-primary btn-md" 
                onClick={() => updateServiceWorker(true)}
              >
                Actualizar ahora
              </button>
            ) : (
              <button className="btn btn-secondary btn-md" onClick={close}>
                Entendido
              </button>
            )}
            <button className="mode-toggle" onClick={close}>
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
