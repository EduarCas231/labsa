import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Registros.css';
import Swal from 'sweetalert2';

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

      Swal.fire({
        title: 'Éxito',
        text: 'Visita actualizada correctamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/visitas');
      });
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  if (loading) return <p className="loading-message">Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="visita-form-container">
      <h2>Editar Visita</h2>
      <form onSubmit={handleSubmit} className="visita-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={visita.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido Paterno:</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={visita.apellidoPaterno}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido Materno:</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={visita.apellidoMaterno}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Lugar:</label>
          <input
            type="text"
            name="lugar"
            value={visita.lugar}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Hora:</label>
          <input
            type="time"
            name="hora"
            value={visita.hora}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Día:</label>
          <input
            type="date"
            name="dia"
            value={visita.dia}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Departamento:</label>
          <input
            type="text"
            name="departamento"
            value={visita.departamento}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Detalle:</label>
          <textarea
            name="detalle"
            value={visita.detalle}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            Guardar cambios
          </button>
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/visitas')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editar;