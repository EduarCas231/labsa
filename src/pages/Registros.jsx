import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './reg.css';

const Registros = () => {
  const navigate = useNavigate();

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    lugar: 'LABSA S.A. DE C.V.', // Valor fijo para el lugar
    hora: '',
    dia: '',
    departamento: '',
    detalle: '',
  });

  // Opciones para el campo "departamento"
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

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe automáticamente

    try {
      // Envía los datos a la API
      const response = await fetch('https://18.226.185.47/visitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        mode: 'cors', // Asegurar que se permite desde otros orígenes
        credentials: 'same-origin' // Si la API necesita autenticación
      }).catch(error => console.error("Error en la petición:", error));
      

      // Si la visita se registra correctamente, muestra la alerta de SweetAlert2
      Swal.fire({
        title: 'Visita Registrada',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then((result) => {
        
        if (result.isConfirmed) {
          navigate('/Visitas');
        }
      });
    } catch (error) {
      console.error('Error:', error);
      // Muestra una alerta de error si algo sale mal
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un error al registrar la visita. Por favor, intenta de nuevo.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className="registro-container">
      <h1>Registrar Nueva Visita</h1>
      <form onSubmit={handleSubmit} className="registro-form">
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
            readOnly // Hace que el campo sea de solo lectura
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
    </div>
  );
};

export default Registros;
