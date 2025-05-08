import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Visita = () => {
  const [visitas, setVisitas] = useState([]); 
  const [filtro, setFiltro] = useState({
    hora: '',
    dia: '',
    mes: '',
    departamento: '',
  });
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores

  const navigate = useNavigate();

  // Función para obtener las visitas desde la API
  const fetchVisitas = async () => {
    try {
      const response = await fetch('https://3.12.74.141/visitas'); // Cambia la URL si es necesario
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data = await response.json();
      setVisitas(data); 
    } catch (error) {
      setError(error.message); // Maneja el error
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  // Llama a fetchVisitas cuando el componente se monta
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
      const response = await fetch(`https://3.12.74.141/visitas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la visita');
      }

      // Actualiza la lista de visitas después de eliminar
      setVisitas(visitas.filter((visita) => visita.id_v !== id));
      Swal.fire({
  
              title: 'Visita eliminada con exito',
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
            placeholder="Filtrar por día"
            value={filtro.dia}
            onChange={handleFiltroChange}
          />
          <input
            type="month"
            name="mes"
            placeholder="Filtrar por mes"
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
            <tr key={visita.id_v}>
              <td>{visita.nombre}</td>
              <td>{visita.apellidoPaterno}</td>
              <td>{visita.apellidoMaterno}</td>
              <td>{visita.lugar}</td>
              <td>{visita.hora}</td>
              <td>{visita.dia}</td>
              <td>{visita.departamento}</td>
              <td>{visita.detalle}</td>
              <td className="acciones">
                <button onClick={() => handleEditar(visita.id_v)}>Editar</button>
                <button className="borrar" onClick={() => handleBorrar(visita.id_v)}>Borrar</button>
                <button onClick={() => handleDetalle(visita.id_v)}>Detalle</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Visita;
