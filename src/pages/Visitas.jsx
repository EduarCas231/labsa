import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Visitas.css';

const Visita = () => {
  const [visitas, setVisitas] = useState([]); 
  const [filtro, setFiltro] = useState({
    hora: '',
    dia: '',
    mes: '',
    departamento: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchVisitas = async () => {
    try {
      const response = await fetch('https://18.226.185.47/visitas');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setVisitas(data); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitas();
  }, []);

  const handleRegistroVisita = () => {
    navigate('/Registro');
  };

  const handleEditar = (id) => {
    console.log(`Editar visita con id: ${id}`);
  };

  const handleBorrar = async (id) => {
    try {
      const response = await fetch(`https://18.226.185.47/visitas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la visita');
      }

      setVisitas(visitas.filter((visita) => visita.id !== id));
      Swal.fire({
        title: 'Visita eliminada con éxito',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        text: 'No se pudo eliminar la visita',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  const handleDetalle = (id) => {
    console.log(`Ver detalle de visita con id: ${id}`);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro({
      ...filtro,
      [name]: value,
    });
  };

  const filtrarVisitas = () => {
    return visitas.filter((visita) => {
      const coincideHora = filtro.hora ? visita.hora.includes(filtro.hora) : true;
      const coincideDia = filtro.dia ? visita.dia === filtro.dia : true;
      const coincideMes = filtro.mes ? visita.dia.startsWith(filtro.mes) : true;
      const coincideDepartamento = filtro.departamento
        ? visita.departamento.toLowerCase().includes(filtro.departamento.toLowerCase())
        : true;

      return coincideHora && coincideDia && coincideMes && coincideDepartamento;
    });
  };

  const visitasFiltradas = filtrarVisitas();

  // Función para capitalizar la primera letra
  const capitalizar = (texto) => {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  // Mostrar loader o error si aplica
  if (loading) {
    return <div>Cargando...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <div className="visita-container">
      <h1>Lista de Visitas</h1>
      <button onClick={handleRegistroVisita}>Registro de Visita</button>

      {/* Formulario de filtrado */}
      <div className="filtro-container">
        <h2>Filtrar Visitas</h2>
        <div className="filtro-form">
          <input
            type="text"
            name="hora"
            placeholder="Filtrar por hora (ej: 10:00 AM)"
            value={filtro.hora}
            onChange={handleFiltroChange}
          />
          <input
            type="date"
            name="dia"
            value={filtro.dia}
            onChange={handleFiltroChange}
          />
          <input
            type="month"
            name="mes"
            value={filtro.mes}
            onChange={handleFiltroChange}
          />
          <input
            type="text"
            name="departamento"
            placeholder="Filtrar por departamento"
            value={filtro.departamento}
            onChange={handleFiltroChange}
          />
        </div>
      </div>

      {/* Tabla de visitas */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Lugar</th>
            <th>Hora</th>
            <th>Día</th>
            <th>Departamento</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visitasFiltradas.map((visita) => (
            <tr key={visita.id}>
              <td>{visita.nombre}</td>
              <td>{visita.apellidoPaterno}</td>
              <td>{visita.apellidoMaterno}</td>
              <td>{visita.lugar}</td>
              <td>{visita.hora}</td>
              <td>
                {capitalizar(new Date(visita.dia).toLocaleDateString('es-MX', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }))}
              </td>
              <td>{visita.departamento}</td>
              <td>{visita.detalle}</td>
              <td className="acciones">
                <button onClick={() => handleEditar(visita.id)}>Editar</button>
                <button className="borrar" onClick={() => handleBorrar(visita.id)}>Borrar</button>
                <button onClick={() => handleDetalle(visita.id)}>Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Visita;
