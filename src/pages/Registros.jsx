import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUser, FiClock, FiCalendar, FiBriefcase, FiFileText, FiPlus, FiX } from 'react-icons/fi';
import './Registros.css';

const Registros = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    hora: '',
    dia: '',
    departamento: '',
    detalle: ''
  });

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.nombre.trim()) errors.push('Nombre');
    if (!formData.apellidoPaterno.trim()) errors.push('Apellido Paterno');
    if (!formData.hora) errors.push('Hora');
    if (!formData.dia) errors.push('Fecha');
    if (!formData.departamento) errors.push('Departamento');
    return errors;
  };

  const formatFecha = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    return `${dateStr} ${timeStr}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      Swal.fire({
        title: 'Campos incompletos',
        html: `<p>Faltan: <strong>${errors.join(', ')}</strong></p>`,
        icon: 'warning',
        confirmButtonColor: '#2b91e7'
      });
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim() || null,
        lugar: 'LABSA S.A. DE C.V.',
        fecha: formatFecha(formData.dia, formData.hora),
        departamento: formData.departamento,
        detalle: formData.detalle.trim() || null
      };

      const response = await fetch('https://18.226.185.47/visitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      Swal.fire({
        title: '¡Registro exitoso!',
        html: `
          <div class="success-modal">
            <p>ID Visita: <strong>${data.id}</strong></p>
            <p>Nombre: <strong>${payload.nombre} ${payload.apellidoPaterno}</strong></p>
            <p>Fecha: ${formData.dia} - ${formData.hora}</p>
            <p>Departamento: ${payload.departamento}</p>
            <p>Código: <strong>${data.codigo}</strong></p>
            <img src="data:image/png;base64,${data.qr_base64}" alt="Código QR" class="qr-image"/>
            <p class="qr-instruction">Recuerde presentar su identificación al ingresar</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#2b91e7',
        willClose: () => navigate('/visitas')
      });

    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error en el registro',
        text: `No se pudo completar el registro. ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#2b91e7'
      });
    }
  };

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h1>Registrar Nueva Visita</h1>
        <p>Complete el formulario para registrar una nueva visita</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">
              <FiUser className="input-icon" />
              <span>Nombre*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>

          {/* Apellido Paterno */}
          <div className="form-group">
            <label className="form-label">
              <FiUser className="input-icon" />
              <span>Apellido Paterno*</span>
            </label>
            <input
              type="text"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleChange}
              className="form-input"
              required
              autoComplete="off"
            />
          </div>

          {/* Apellido Materno */}
          <div className="form-group">
            <label className="form-label">
              <FiUser className="input-icon" />
              <span>Apellido Materno</span>
            </label>
            <input
              type="text"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
          </div>

          {/* Hora */}
          <div className="form-group">
            <label className="form-label">
              <FiClock className="input-icon" />
              <span>Hora*</span>
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label className="form-label">
              <FiCalendar className="input-icon" />
              <span>Fecha*</span>
            </label>
            <input
              type="date"
              name="dia"
              value={formData.dia}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Departamento */}
          <div className="form-group">
            <label className="form-label">
              <FiBriefcase className="input-icon" />
              <span>Departamento*</span>
            </label>
            <select
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccione...</option>
              {departamentos.map((depto, i) => (
                <option key={i} value={depto}>{depto}</option>
              ))}
            </select>
          </div>

          {/* Detalles */}
          <div className="form-group full-width">
            <label className="form-label">
              <FiFileText className="input-icon" />
              <span>Detalles adicionales</span>
            </label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/visitas')}
          >
            <FiX className="btn-icon" />
            Cancelar
          </button>
          <button type="submit" className="submit-btn">
            <FiPlus className="btn-icon" />
            Registrar Visita
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registros;