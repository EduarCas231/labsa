import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiPlus, FiCalendar, FiClock, FiHome } from 'react-icons/fi';
import './Visitas.css';

const Visita = () => {
  const [visitas, setVisitas] = useState([]);
  const [filtro, setFiltro] = useState({
    hora: '',
    dia: '',
    departamento: '',
    nombre: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 10;

  const navigate = useNavigate();

  const fetchVisitas = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filtro.nombre) params.append('nombre', filtro.nombre);
      if (filtro.departamento) params.append('departamento', filtro.departamento);

      const response = await fetch(`https://18.226.185.47/visitas?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();

      const normalizeDate = (dateString) => {
        if (!dateString) return '';
        try {
          // Parse the date string directly without timezone adjustment
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (e) {
          console.error('Error normalizando fecha:', dateString, e);
          return '';
        }
      };

      const visitasFiltradas = data.filter((visita) => {
        // Filtro por hora
        if (filtro.hora) {
          const visitaHora = visita.hora?.split(':')[0] || '';
          const filtroHora = filtro.hora.split(':')[0];
          if (visitaHora !== filtroHora) return false;
        }

        // Filtro por día específico
        if (filtro.dia) {
          const visitaDia = normalizeDate(visita.dia);
          const filtroDia = normalizeDate(filtro.dia);
          if (visitaDia !== filtroDia) return false;
        }

        return true;
      });

      setVisitas(visitasFiltradas);
    } catch (error) {
      setError(error.message);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron cargar las visitas',
        icon: 'error',
        confirmButtonColor: '#4f46e5'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, [filtro]);

  const handleRegistroVisita = () => navigate('/Registro');
  const handleEditar = (id) => navigate(`/editar/${id}`);
  const handleDetalle = (id) => navigate(`/detalles/${id}`);

  const handleBorrar = async (id) => {
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`https://18.226.185.47/visitas/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Error al eliminar la visita');

        setVisitas(visitas.filter((visita) => visita.id !== id));
        Swal.fire({
          title: '¡Eliminado!',
          text: 'La visita ha sido eliminada.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la visita',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5'
        });
      }
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFiltro({
      hora: '',
      dia: '',
      departamento: '',
      nombre: ''
    });
  };

  const formatDate = (dateString) => {
    try {
      // Create date object without timezone adjustment
      const date = new Date(dateString);
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC' // Add this to prevent date shifting
      };
      return date.toLocaleDateString('es-MX', options)
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Fecha inválida';
    }
  };

  // Paginación
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = visitas.slice(indexOfFirstVisit, indexOfLastVisit);
  const totalPages = Math.ceil(visitas.length / visitsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando visitas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchVisitas}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="visita-container">
      <div className="header-section">
        <div className="header-content">
          <h1>Registro de Visitas</h1>
        </div>
        <button className="btn-primary" onClick={handleRegistroVisita}>
          <FiPlus /> Nueva Visita
        </button>
      </div>

      <div className="card filtro-section">
        <div className="filtro-header">
          <FiSearch className="filtro-icon" />
          <h2>Filtrar Visitas</h2>
        </div>
        <div className="filtro-grid">
          <div className="input-group">
            <label>Nombre del Visitante</label>
            <input
              type="text"
              name="nombre"
              placeholder="Buscar por nombre"
              value={filtro.nombre}
              onChange={handleFiltroChange}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label>Departamento</label>
            <div className="input-with-icon">
              <FiHome className="input-icon" />
              <input
                type="text"
                name="departamento"
                placeholder="Filtrar por departamento"
                value={filtro.departamento}
                onChange={handleFiltroChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Hora</label>
            <div className="input-with-icon">
              <FiClock className="input-icon" />
              <input
                type="time"
                name="hora"
                value={filtro.hora}
                onChange={handleFiltroChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Fecha</label>
            <div className="input-with-icon">
              <FiCalendar className="input-icon" />
              <input
                type="date"
                name="dia"
                value={filtro.dia}
                onChange={handleFiltroChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
        <div className="filtro-actions">
          <button className="btn-secondary" onClick={handleResetFilters}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <div className="results-summary">
        <span className="badge">{visitas.length} visitas encontradas</span>
      </div>

      <div className="card table-section">
        <div className="table-responsive">
          <table className="visitas-table">
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Lugar</th>
                <th>Hora</th>
                <th>Fecha</th>
                <th>Departamento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentVisits.length > 0 ? (
                currentVisits.map((visita) => (
                  <tr key={visita.id}>
                    <td>
                      <div className="visitor-info">
                        <strong>{visita.nombre} {visita.apellidoPaterno} {visita.apellidoMaterno}</strong>
                        <p className="visitor-detail">{visita.detalle?.substring(0, 30)}{visita.detalle?.length > 30 ? '...' : ''}</p>
                      </div>
                    </td>
                    <td>{visita.lugar}</td>
                    <td>{visita.hora}</td>
                    <td>{formatDate(visita.dia)}</td>
                    <td>
                      <span className="dept-badge">{visita.departamento}</span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-action info" 
                        onClick={() => handleDetalle(visita.id)} 
                        title="Ver detalles"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="btn-action edit" 
                        onClick={() => handleEditar(visita.id)} 
                        title="Editar"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="btn-action delete" 
                        onClick={() => handleBorrar(visita.id)} 
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-results">
                  <td colSpan="6">
                    <div className="no-results-content">
                      <FiSearch size={24} />
                      <p>No se encontraron visitas con los filtros aplicados</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button 
              onClick={() => paginate(Math.max(1, currentPage - 1))} 
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              &larr;
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Visita;