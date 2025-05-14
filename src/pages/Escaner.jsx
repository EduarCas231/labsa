import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader'; // Importación corregida
import Swal from 'sweetalert2';
import { FiCamera, FiCheckCircle, FiSearch } from 'react-icons/fi';
import './Escanear.css';

function Escaner() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');

  const verificarVisita = async (idVisita) => {
    try {
      const response = await fetch(`https://18.226.185.47/visitas/${idVisita}`);
      
      if (!response.ok) {
        throw new Error('Visita no encontrada');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al verificar visita:', error);
      throw error;
    }
  };

  const handleScan = async (data) => {
    if (!data) return;
    
    try {
      const idVisita = data.match(/\d+/)?.[0];
      if (!idVisita) throw new Error('Formato de código QR inválido');

      const visita = await verificarVisita(idVisita);
      
      Swal.fire({
        title: 'Visita encontrada',
        html: `
          <div class="scan-result">
            <p><strong>Visitante:</strong> ${visita.nombre} ${visita.apellidoPaterno || ''}</p>
            <p><strong>Departamento:</strong> ${visita.departamento}</p>
            <p><strong>Fecha:</strong> ${new Date(visita.dia).toLocaleDateString('es-MX')}</p>
            <div class="scan-actions">
              <button class="swal-confirm" id="view-details">Ver detalles</button>
              <button class="swal-cancel" id="new-scan">Nuevo escaneo</button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        didOpen: () => {
          document.getElementById('view-details')?.addEventListener('click', () => {
            navigate(`/detalles/${visita.id}`);
          });
          
          document.getElementById('new-scan')?.addEventListener('click', () => {
            setScanning(true);
            Swal.close();
          });
        }
      });
      
      setScanning(false);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se encontró esta visita en el sistema',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    }
  };

  const handleError = (err) => {
    console.error(err);
    Swal.fire({
      title: 'Error de cámara',
      text: 'No se pudo acceder a la cámara. Verifica los permisos o ingresa el código manualmente.',
      icon: 'error',
      confirmButtonColor: '#4f46e5'
    });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      await handleScan(manualCode);
    }
  };

  return (
    <div className="scanner-container">
      <div className="scanner-header">
        <h1>Escanear código de visita</h1>
        <p>Escanea el código QR del visitante para verificar su registro</p>
      </div>

      <div className="scanner-section">
        {scanning ? (
          <div className="qr-reader-container">
            <QrReader
              scanDelay={300}
              onResult={(result) => result && handleScan(result?.text)}
              onError={handleError}
              constraints={{ 
                facingMode: 'environment',
                audio: false,
                video: {
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                }
              }}
              containerStyle={{ width: '100%' }}
            />
            <div className="scanner-overlay">
              <div className="scanner-frame"></div>
              <FiCamera className="scanner-icon" />
              <p>Enfoca el código QR dentro del marco</p>
            </div>
          </div>
        ) : (
          <div className="scan-result-preview">
            <FiCheckCircle className="success-icon" />
            <p>Escaneo completado</p>
            <button 
              className="btn-secondary"
              onClick={() => setScanning(true)}
            >
              Escanear otro código
            </button>
          </div>
        )}

        <div className="manual-entry">
          <h3>O ingresa el ID manualmente</h3>
          <form onSubmit={handleManualSubmit}>
            <div className="input-with-icon">
              <FiSearch className="input-icon" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ingresa el ID de visita"
                required
                pattern="\d+"
                title="Por favor ingresa solo números (ID de visita)"
              />
            </div>
            <button type="submit" className="btn-primary">
              Verificar
            </button>
          </form>
        </div>
      </div>

      <div className="scanner-footer">
        <p>Sistema de gestión de visitas - LABSA</p>
      </div>
    </div>
  );
}

export default Escaner;