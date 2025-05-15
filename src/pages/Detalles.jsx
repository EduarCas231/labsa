import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './Detalles.css';

const Detalles = () => {
  const { id } = useParams();
  const [visita, setVisita] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDetalleVisita = async () => {
      try {
        const response = await fetch(`https://18.226.185.47/visitas/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la visita');
        }
        const data = await response.json();
        setVisita(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    obtenerDetalleVisita();
  }, [id]);

  if (loading) return <p>Cargando detalles...</p>;
  if (!visita) return <p>No se encontró la visita.</p>;

  // Convertir fecha a objeto Date
  const fechaObj = new Date(visita.fecha);
  // Obtener día y hora en formato legible
  const dia = fechaObj.toLocaleDateString();   // Ejemplo: 15/5/2025 (según local)
  const hora = fechaObj.toLocaleTimeString();  // Ejemplo: 14:30:00

  const qrData = `Visita ID: ${visita.id}, Nombre: ${visita.nombre} ${visita.apellidoPaterno}`;

  return (
    <div className="detalles-container">
      <h2>Detalle de la visita  <span> {id}</span></h2>
      <p><strong>Nombre:</strong> <span>{visita.nombre}</span></p>
      <p><strong>Apellido Paterno:</strong> <span>{visita.apellidoPaterno}</span></p>
      <p><strong>Apellido Materno:</strong> <span>{visita.apellidoMaterno || 'N/A'}</span></p>
      <p><strong>Departamento:</strong> <span>{visita.departamento}</span></p>
      <p><strong>Lugar:</strong> <span>{visita.lugar}</span></p>
      <p><strong>Hora:</strong> <span>{hora}</span></p>
      <p><strong>Día:</strong> <span>{dia}</span></p>
      <p><strong>Detalle:</strong> <span>{visita.detalle || 'N/A'}</span></p>

      <div className="qr-section">
        <h3>Código QR</h3>
        <QRCodeCanvas value={qrData} size={200} />
      </div>
    </div>
  );
};

export default Detalles;
