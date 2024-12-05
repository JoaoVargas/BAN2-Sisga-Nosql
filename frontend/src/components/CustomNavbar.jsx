import React from 'react';
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CustomToast from './CustomToast';



const CustomNavbar = ( {showToast, setShowToast, messageToast, setMessageToast,  variantToast, setVariantToast} ) => {
  const navigate = useNavigate();
  
  const handleInicializar = () => {
    fetch('http://0.0.0.0:5002/inicializar', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.error) {
        setMessageToast(data.error)
        setVariantToast('danger')
        setShowToast(true)
        return
      }
      setMessageToast(data.message)
      setVariantToast('success')
      setShowToast(true)
      navigate('/home')
    });
  }

  return (
    <>
      <Navbar 
      expand="lg" 
      className="bg-body-tertiary">
        <Container>
          <Navbar.Brand 
          onClick={() => navigate("/home")}
          role='button'>
            SISGA
          </Navbar.Brand>
          <Navbar.Toggle 
          aria-controls="basic-navbar-nav" />
          <Navbar.Collapse 
          id="basic-navbar-nav">
            <Nav 
            className="me-auto">
              <Nav.Link 
              onClick={() => navigate("/alunos")}>
                Alunos
              </Nav.Link>
              <Nav.Link 
              onClick={() => navigate("/professores")}>
                Professores
              </Nav.Link>
              <Nav.Link 
              onClick={() => navigate("/coordenadores")}>
                Coordenadores
              </Nav.Link>
              <Nav.Link 
              onClick={() => handleInicializar()}>
                Inicializar Dados no Banco
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CustomToast 
      showToast={showToast} 
      setShowToast={setShowToast}
      messageToast={messageToast} 
      variantToast={variantToast} />
    </>
  );
}

export default CustomNavbar;
