import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiSearch, FiClock } from 'react-icons/fi';
import './Visitas.css';

const Visita = () => {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const visitsPerPage = 10;

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroHora, setFiltroHora] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const navigate = useNavigate();

  const fetchVisitas = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:4000/api/visitas');

      if (!response.ok) throw new Error('Error al obtener los datos');

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Formato inesperado de datos recibidos');
      }

      setVisitas(data.data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#2b91e7'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleRegistroVisita = () => navigate('/Registro');
  const handleEditar = (id) => navigate(`/editar/${id}`);
  const handleDetalle = (id) => navigate(`/detalles/${id}`);

  const handleBorrar = async (id) => {
    const confirmResult = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2b91e7',
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
      } catch {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la visita',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#2b91e7'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      return date.toLocaleDateString('es-MX', options)
        .replace(/\b\w/g, l => l.toUpperCase());
    } catch {
      return 'Fecha inválida';
    }
  };

  // Filtrar visitas según inputs
  const visitasFiltradas = visitas.filter((visita) => {
    const nombreCompleto = `${visita.nombre} ${visita.apellidoPaterno} ${visita.apellidoMaterno}`.toLowerCase();
    const horaVisita = visita.hora?.substring(0, 5) || '';

    const filtroNombreOk = nombreCompleto.includes(filtroNombre.trim().toLowerCase());
    const filtroHoraOk = horaVisita.includes(filtroHora.trim());
    const filtroDepartamentoOk = visita.departamento?.toLowerCase().includes(filtroDepartamento.trim().toLowerCase()) ?? true;
    const filtroFechaOk = filtroFecha ? visita.dia === filtroFecha : true;

    return filtroNombreOk && filtroHoraOk && filtroDepartamentoOk && filtroFechaOk;
  });

  // Paginación
  const indexOfLastVisit = currentPage * visitsPerPage;
  const indexOfFirstVisit = indexOfLastVisit - visitsPerPage;
  const currentVisits = visitasFiltradas.slice(indexOfFirstVisit, indexOfLastVisit);
  const totalPages = Math.ceil(visitasFiltradas.length / visitsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [filtroNombre, filtroHora, filtroDepartamento, filtroFecha]);

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Cargando visitas...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <div className="error-card">
        <h2>Error al cargar datos</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchVisitas}>
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Registro de Visitas</h1>
          <p>Administra y revisa el historial de visitas</p>
        </div>
        <button className="primary-btn add-btn" onClick={handleRegistroVisita}>
          <FiPlus className="btn-icon" /> Nueva Visita
        </button>
      </div>

      <div className="stats-badge">
        <span>{visitasFiltradas.length} visitas encontradas</span>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <FiSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Nombre del visitante"
            value={filtroNombre}
            onChange={(e) => setFiltroNombre(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <FiClock className="filter-icon" />
          <input
            type="text"
            placeholder="Hora (HH:MM)"
            value={filtroHora}
            onChange={(e) => setFiltroHora(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <FiSearch className="filter-icon" />
          <input
            type="text"
            placeholder="Departamento"
            value={filtroDepartamento}
            onChange={(e) => setFiltroDepartamento(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="filter-input date-input"
          />
        </div>
      </div>

      <div className="data-card">
        <div className="table-wrapper">
          <table className="data-table">
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
                currentVisits.map(visita => (
                  <tr key={visita.id}>
                    <td className="visitor-cell">
                      <span className="visitor-name">{`${visita.nombre} ${visita.apellidoPaterno} ${visita.apellidoMaterno}`}</span>
                    </td>
                    <td>{visita.lugar || '-'}</td>
                    <td>{visita.hora?.substring(0, 5) || '-'}</td>
                    <td>{formatDate(visita.dia)}</td>
                    <td>{visita.departamento || '-'}</td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEditar(visita.id)}
                          title="Editar"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleBorrar(visita.id)}
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleDetalle(visita.id)}
                          title="Detalles"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-data-row">
                  <td colSpan="6">
                    <div className="no-data-message">
                      No se encontraron visitas con los filtros actuales
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visita;