import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import Swal from 'sweetalert2';
import { FiCamera, FiCheckCircle, FiKey, FiRefreshCw } from 'react-icons/fi';
import './Escanear.css';

function Escaner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [facingMode, setFacingMode] = useState('environment');
  const [hasCameraSupport, setHasCameraSupport] = useState(true);
  const qrScannerRef = useRef(null);

  useEffect(() => {
    const checkCameraSupport = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setHasCameraSupport(false);
          return;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length < 2) {
          setHasCameraSupport(false);
        }
      } catch (error) {
        console.error('Error al verificar cámaras:', error);
        setHasCameraSupport(false);
      }
    };

    checkCameraSupport();
  }, []);

  const verificarVisita = async (codigo) => {
    console.log('[DEBUG] Verificando código:', codigo);

    try {
      const cleanCode = codigo.trim();
      const apiUrl = `https://18.226.185.47/visitas/codigo/${encodeURIComponent(cleanCode)}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Visita no encontrada');
      }

      const visita = await response.json();
      return visita;
    } catch (error) {
      throw error;
    }
  };

  const handleScan = async (codigo) => {
    if (!codigo) return;

    setScanning(false);

    try {
      const visita = await verificarVisita(codigo);

      Swal.fire({
        title: 'VISITA VERIFICADA',
        html: `
          <div class="verification-result">
            <h4>${visita.nombre} ${visita.apellidoPaterno}</h4>
            <div class="detail-row"><strong>Departamento:</strong> ${visita.departamento}</div>
            <div class="detail-row"><strong>Fecha:</strong> ${visita.dia}</div>
            <div class="detail-row"><strong>Hora:</strong> ${visita.hora?.substring(0, 5)}</div>
            ${visita.detalle ? `<div class="detail-row"><strong>Detalle:</strong> ${visita.detalle}</div>` : ''}
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#2b91e7',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      Swal.fire({
        title: 'Código no válido',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#2b91e7',
        confirmButtonText: 'Reintentar'
      }).then(() => {
        setScanning(true);
      });
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      Swal.fire({
        title: 'Advertencia', 
        text: 'Ingresa un código válido',
        icon: 'warning',
        confirmButtonColor: '#2b91e7'
      });
      return;
    }

    await handleScan(manualCode);
  };

  const toggleCamera = () => {
    setScanning(!scanning);
    setManualCode('');
  };

  const switchCamera = async () => {
    try {
      // Detener la cámara actual primero
      if (qrScannerRef.current) {
        const videoElement = qrScannerRef.current.video;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject;
          stream.getTracks().forEach(track => track.stop());
        }
      }

      // Cambiar a la otra cámara
      const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
      setFacingMode(newFacingMode);
      
      // Forzar reinicio del scanner
      setScanning(false);
      setTimeout(() => setScanning(true), 100);
      
    } catch (error) {
      console.error('Error al cambiar cámara:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo cambiar la cámara. Intente recargar la página.',
        icon: 'error',
        confirmButtonColor: '#2b91e7'
      });
    }
  };

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h1>Escanear Visita</h1>
        <p>Escanea el código QR o ingresa manualmente el código</p>
      </div>

      <div className="scanner-content">
        {scanning ? (
          <>
            <div className="qr-reader-container">
              <div className="qr-reader-wrapper">
                {scanning && (
                  <QrScanner
                    key={`scanner-${facingMode}`}
                    ref={qrScannerRef}
                    delay={500}
                    onError={(err) => {
                      console.error('[QR Error]', err);
                      if (err.name === 'NotAllowedError') {
                        Swal.fire({
                          title: 'Permiso denegado',
                          text: 'Por favor permite el acceso a la cámara',
                          icon: 'error',
                          confirmButtonColor: '#2b91e7'
                        });
                      }
                    }}
                    onScan={(result) => {
                      if (result) {
                        handleScan(result.text || result);
                      }
                    }}
                    style={{ width: '100%' }}
                    facingMode={facingMode}
                    constraints={{
                      audio: false,
                      video: {
                        facingMode: facingMode,
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                      }
                    }}
                  />
                )}
                <div className="scan-frame"></div>
                {hasCameraSupport && (
                  <button 
                    className="switch-camera-btn"
                    onClick={switchCamera}
                    title={`Cambiar a cámara ${facingMode === 'environment' ? 'frontal' : 'trasera'}`}
                  >
                    <FiRefreshCw size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="manual-entry">
              <div className="manual-entry-header">
                <FiKey className="input-icon" />
                <h3>Ingreso manual</h3>
              </div>
              <form onSubmit={handleManualSubmit} className="manual-form">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ej: abc123xyz"
                  autoComplete="off"
                  className="manual-input"
                />
                <button type="submit" className="btn-primary">
                  Verificar código
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="scan-success">
            <div className="success-icon">
              <FiCheckCircle size={64} />
            </div>
            <h3>Verificación completada</h3>
            <button className="btn-primary" onClick={toggleCamera}>
              <FiCamera className="btn-icon" /> Escanear otro código
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Escaner;