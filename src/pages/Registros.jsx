import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Registros.css';

const Registros = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    lugar: 'LABSA S.A. DE C.V.',
    hora: '',
    dia: '',
    departamento: '',
    detalle: '',
  });

  const [qrData, setQrData] = useState(null);

  const departamentos = [
    'Dirección',
    'Tisc',
    'Almacén',
    'Sala de Juntas',
    'Sala de Usos Múltiples',
    'Fisicoquímicos',
    'Muestreo',
    'Cromatografía',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://18.226.185.47/visitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors',
        credentials: 'same-origin',
      });

      if (response && response.ok) {
        const data = await response.json();
        setQrData(data.qr_base64);

        Swal.fire({
          title: 'Visita Registrada',
          text: 'Se generó un código QR con los datos.',
          icon: 'success',
          confirmButtonText: 'Ver QR',
        });
      } else {
        throw new Error('Error al registrar');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un error al registrar la visita. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleRegresar = () => {
    navigate('/visitas');
  };

  return (
    <div className="visita-form-container">
      <h1>Registrar Nueva Visita</h1>
      <form onSubmit={handleSubmit} className="visita-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido Paterno:</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellido Materno:</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Lugar:</label>
          <input
            type="text"
            name="lugar"
            value={formData.lugar}
            onChange={handleChange}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Hora:</label>
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Día:</label>
          <input
            type="date"
            name="dia"
            value={formData.dia}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Departamento:</label>
          <select
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un departamento</option>
            {departamentos.map((depto, index) => (
              <option key={index} value={depto}>
                {depto}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Detalle:</label>
          <textarea
            name="detalle"
            value={formData.detalle}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button">
          Registrar Visita
        </button>
      </form>

      {qrData && (
        <div className="qr-container">
          <h2>Código QR de la Visita</h2>
          <img src={`data:image/png;base64,${qrData}`} alt="Código QR" />
        </div>
      )}

      <button onClick={handleRegresar} className="regresar-button">
        Regresar a Visitas
      </button>
    </div>
  );
};

export default Registros;