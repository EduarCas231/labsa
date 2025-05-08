import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Visitas from './pages/Visitas';
import Escaner from './pages/Escaner';
import Registro from './pages/Registros'

// Componente Navbar
const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/Visitas">Lista de visitas</Link>
        </li>
        <li>
          <Link to="/Escaner">Escaner</Link>
        </li>
      </ul>
    </nav>
  );
};

// Componente Home (contenido principal)
const Home = () => {
  return (
    <div className="app-container">
      {/* Logo */}
      <div className="logo-container">
        <img src="/labsa.png" alt="Logo de Labsa" className="logo" aria-label="Logo de Labsa" />
      </div>

      {/* Título y descripción */}
      <div className="title-container">
        <h1 className="main-title">LABORATORIOS Y SUMINISTROS AMBIENTALES E INDUSTRIALES</h1>
        <p className="description"><strong>Laboratorio ACREDITADO por la EMA y APROBADO por CONAGUA, STPS y PROFEPA.</strong></p>
      </div>

      {/* Sección Historia */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h3 className="section-title">Historia</h3>
  
          </div>

          <div className="timeline-container">
            {[
              { year: '2011', title: 'Fundación', description: 'Laboratorios y Suministros Ambientales e Industriales brinda servicios de análisis microbiológicos y fisicoquímicos en aguas residuales y suelos contaminados, así como en ambiente laboral.' },
              { year: '2012', title: 'Acreditación y Aprobación', description: 'Logramos la acreditación POR EMA y la aprobación por parte de la CONAGUA, PROFEPA y STPS.' },
              { year: '2015', title: 'Ampliación de Signatarios', description: 'Durante la renovación de la acreditación ante la EMA, ampliamos la plantilla de signatarios y personal.' },
              { year: '2018', title: 'Pruebas de Aptitud Satisfactorias', description: 'Participamos en ensayos de aptitud a nivel nacional e internacional obteniendo resultados satisfactorios.' },
              { year: '2022', title: 'Compromiso', description: 'Seguimos creciendo y capacitando a nuestro personal y clientes para garantizar el cumplimiento de la normatividad nacional e internacional.' }
            ].map((event, index) => (
              <article key={index} className="timeline-event">
                <div className="timeline-date">{event.year}</div>
                <div className="timeline-content">
                  <h4 className="timeline-title">{event.title}</h4>
                  <p className="timeline-text">{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sección "¿Quiénes Somos?" */}
      <section className="header6 mbr-fullscreen mbr-parallax-background" id="header6-1e">
        <div className="mbr-overlay" style={{ textAlign:"center", opacity: 0.7, backgroundColor: "rgb(68, 121, 217)", fontSize:"20px" }}></div>
        <div className="align-center container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <h1 className="mbr-section-title mbr-fonts-style mbr-white mb-3 display-1">
                <strong>¿Quiénes Somos?</strong>
              </h1>
              <p className="mbr-text mbr-white mbr-fonts-style display-7" style={{ textAlign:"justify", fontSize:"20px" }}>
                <strong>
                  LABSA es un laboratorio de análisis ambientales e industriales, especializado en la rama de agua residual y suelo contaminado. Contamos con más de 10 años de experiencia en la industria, con equipos y tecnología de punta, garantizando la satisfacción de nuestros clientes y la confiabilidad de nuestros análisis y resultados.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>
            
      {/* Sección de Misión, Visión y Valores */}
      <section className="clients2" id="clients2-x">
        <div className="container-fluid">
          <div className="row justify-content-center">
            {/* Misión */}
            <div className="card col-12 col-md-6 col-lg-4">
              <div className="card-wrapper">
                <div className="card-box align-center">
                  <h5 className="card-title mbr-fonts-style mb-3 display-5" style={{}}><strong style={{fontSize:"20px"}}>Misión</strong></h5>
                  <p className="mbr-text mbr-fonts-style mb-4 display-4">
                    Realizar muestreo y análisis de la industria, aguas, aire, fuentes fijas, residuos, suelos, higiene y salud ocupacional, proporcionando resultados confiables.
                  </p>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className="card col-12 col-md-6 col-lg-4">
              <div className="card-wrapper">
                <div className="card-box align-center">
                  <h5 className="card-title mbr-fonts-style mb-3 display-5"><strong><span style={{fontSize:"20px"}}>Visión</span></strong></h5>
                  <p className="mbr-text mbr-fonts-style mb-4 display-4">
                    Ser una empresa reconocida a nivel nacional, apoyando la protección ambiental y la prevención de la contaminación en equilibrio con las condiciones socioeconómicas de las partes interesadas.
                  </p>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="card col-12 col-md-6 col-lg-4">
              <div className="card-wrapper">
                <div className="card-box align-center">
                  <h5 className="card-title mbr-fonts-style mb-3 display-5"><strong style={{fontSize:"20px"}}>Valores</strong></h5>
                  <p className="mbr-text mbr-fonts-style mb-4 display-4">
                    Humildad, Igualdad, Pertenencia, Ética, Eficiencia, Trabajo en Equipo, Solidaridad, Compromiso, Honestidad, Lealtad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Componente App
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* Ruta principal */}
        <Route path="/Visitas" element={<Visitas />} />
        <Route path="/Escaner" element={<Escaner />} />
        <Route path="/Registro" element={<Registro />} /> 
      </Routes>
    </Router>
  );
}

export default App;