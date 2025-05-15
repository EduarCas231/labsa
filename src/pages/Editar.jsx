import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiSave, FiX, FiClock, FiCalendar, FiUser, FiHome, FiBriefcase, FiFileText } from 'react-icons/fi';
import './Editar.css';

const Editar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visita, setVisita] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    lugar: 'LABSA S.A. DE C.V.',
    hora: '',
    dia: '',
    departamento: '',
    detalle: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerVisita = async () => {
      try {
        const response = await fetch(`https://18.226.185.47/visitas/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener los datos de la visita');
        }
        const data = await response.json();
        setVisita(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon: 'error',
          confirmButtonColor: '#2b91e7'
        });
      }
    };

    obtenerVisita();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisita({
      ...visita,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://18.226.185.47/visitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visita)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la visita');
      }

      await Swal.fire({
        title: '¡Éxito!',
        text: 'Visita actualizada correctamente',
        icon: 'success',
        confirmButtonColor: '#2b91e7',
        timer: 1500,
        showConfirmButton: false
      });
      navigate('/visitas');
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#2b91e7'
      });
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando información de la visita...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-card">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          className="retry-btn" 
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h1>Editar Visita</h1>
        <p>Modifica los detalles de la visita registrada</p>
      </div>

      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">
              <FiUser className="input-icon" />
              <span>Nombre</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={visita.nombre}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Apellido Paterno */}
          <div className="form-group">
            <label className="form-label">
              <FiUser className="input-icon" />
              <span>Apellido Paterno</span>
            </label>
            <input
              type="text"
              name="apellidoPaterno"
              value={visita.apellidoPaterno}
              onChange={handleInputChange}
              className="form-input"
              required
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
              value={visita.apellidoMaterno}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Lugar (readonly) */}
          <div className="form-group">
            <label className="form-label">
              <FiHome className="input-icon" />
              <span>Lugar</span>
            </label>
            <input
              type="text"
              name="lugar"
              value={visita.lugar}
              onChange={handleInputChange}
              className="form-input readonly"
              readOnly
            />
          </div>

          {/* Hora */}
          <div className="form-group">
            <label className="form-label">
              <FiClock className="input-icon" />
              <span>Hora</span>
            </label>
            <input
              type="time"
              name="hora"
              value={visita.hora}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label className="form-label">
              <FiCalendar className="input-icon" />
              <span>Fecha</span>
            </label>
            <input
              type="date"
              name="dia"
              value={visita.dia}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Departamento */}
          <div className="form-group">
            <label className="form-label">
              <FiBriefcase className="input-icon" />
              <span>Departamento</span>
            </label>
            <input
              type="text"
              name="departamento"
              value={visita.departamento}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          {/* Detalle */}
          <div className="form-group full-width">
            <label className="form-label">
              <FiFileText className="input-icon" />
              <span>Detalles adicionales</span>
            </label>
            <textarea
              name="detalle"
              value={visita.detalle}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <FiSave className="btn-icon" />
            Guardar cambios
          </button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/visitas')}
          >
            <FiX className="btn-icon" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editar;