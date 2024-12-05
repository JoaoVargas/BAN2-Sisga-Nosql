import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomNavbar from '../../components/CustomNavbar.jsx';
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';

const Curso = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');


  const [curso, setCurso] = useState([]);
  const [cursoCod, setCursoCod] = useState('');
  const [cursoNome, setCursoNome] = useState('');
  const [cursoPeriodo, setCursoPeriodo] = useState('');
  const [cursoCreditos, setCursoCreditos] = useState('');
  const [cursoCoordenador, setCursoCoordenador] = useState(0);
  const [cursoDisciplinas, setCursoDisciplinas] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  let { cod_curso } = useParams();

  useEffect(() => {
    fetch('http://0.0.0.0:5002/cursoscoordenadores/' + cod_curso, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataCurso) => {
      console.log(dataCurso[0]);
      setCurso(dataCurso[0])
      setCursoCod(dataCurso[0][0])
      setCursoNome(dataCurso[0][1])
      setCursoPeriodo(dataCurso[0][2])
      setCursoCreditos(dataCurso[0][3])
      setCursoCoordenador(dataCurso[0][4])
    })
  }, []);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/cursosdisciplinas/' + cod_curso, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataCurso) => {
      console.log(dataCurso);
      setCursoDisciplinas(dataCurso)
    })
  }, []);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/coordenadorespessoas', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataCoordenadores) => {
      console.log(dataCoordenadores);
      setCoordenadores(dataCoordenadores);
    })
  }, []);




  const handleEdit = (event) => {
    event.preventDefault();

    fetch('http://0.0.0.0:5002/cursos/' + curso[0], { 
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "nome": cursoNome,
        "periodo": cursoPeriodo,
        "credito_total": cursoCreditos,
        "cod_coordenador": cursoCoordenador
      })
    })
    .then((res) => res.json())
    .then((e) => {
      if (e.message) {
        setShowToast(true)
        setMessageToast("Curso atualizado com sucesso")
        setVariantToast('success')
        navigate(0)
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao atualizar curso')
        setVariantToast('danger')
      }
    })
    
  }

  const handleExcluir = () => {
    fetch('http://0.0.0.0:5002/cursos/' + curso[0], { 
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((e) => {
      if (e.message) {
        navigate('/coordenadores')
        setShowToast(true)
        setMessageToast("Curso excluido com sucesso")
        setVariantToast('success')
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao excluir curso')
        setVariantToast('danger')
      }
    })
    
  }


  
  return (
    <>
      <CustomNavbar 
      showToast={showToast} 
      setShowToast={setShowToast}
      messageToast={messageToast} 
      setMessageToast={setMessageToast}
      variantToast={variantToast} 
      setVariantToast={setVariantToast}
      />

      <Container
      className='mt-5'>
        <Card >
          <Card.Header className="text-center">Curso {cursoCod}</Card.Header>
          <Card.Body>
            <div
            className='d-flex flex-row justify-content-around'>
              <div 
              className='d-flex flex-column'>
                <p> <b>Nome:</b> {curso[1]} </p>
                <p> <b>Periodo:</b> {curso[2]} </p>
              </div>
              <div 
              className='d-flex flex-column'>
                <p> <b>Créditos Totais:</b> {curso[3]} </p>
                <p> <b>Coordenador:</b> {curso[4]} </p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div
        className='d-flex flex-row justify-content-around mt-3'>
          <Button
          onClick={() => setModalEditar(true)}>
            Editar Curso
          </Button>
          <Button 
          variant='danger'
          onClick={() => setModalExcluir(true)}>
            Excluir Curso
          </Button>
        </div>
      </Container>

      <Container>
        
      </Container>

      <Modal 
      show={modalEditar} 
      onHide={() => setModalEditar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleEdit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Curso {cursoCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="nome">
              <Form.Label>Nome:</Form.Label>
              <Form.Control 
              type="text" 
              value={cursoNome}
              onChange={(e) => setCursoNome(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="periodo">
              <Form.Label>Periodo:</Form.Label>
              <Form.Select onChange={(e) => setCursoPeriodo(e.target.value)} value={cursoPeriodo}>
                <option value="m">Matutino</option>
                <option value="d">Diurno</option>
                <option value="n">Noturno</option>
                <option value="i">Integral</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="creditos">
              <Form.Label>Total de Créditos:</Form.Label>
              <Form.Control 
              type="number" 
              min={"1"}
              step={"1"}
              value={cursoCreditos}
              onChange={(e) => setCursoCreditos(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="periodo">
              <Form.Label>Coordenador:</Form.Label>
              <Form.Select onChange={(e) => setCursoCoordenador(e.target.value)} value={cursoCoordenador}>
                { coordenadores.map((c) => (
                    <option key={c[0]} value={c[0]}>{c[2]}</option>
                  )
                )}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalEditar(false)}>
              Fechar
            </Button>
            <Button type="submit" variant="primary" onClick={() => setModalEditar(false)}>
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal 
      show={modalExcluir} 
      onHide={() => setModalExcluir(false)}
      size="lg"
      centered>
          <Modal.Header closeButton>
            <Modal.Title>Excluir Curso {cursoCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Você tem certeza que deseja excluir esse curso?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalExcluir(false)}>
              Fechar
            </Button>
            <Button 
            type="submit" 
            variant="danger" 
            onClick={() => {handleExcluir()}}>
              Excluir
            </Button>
          </Modal.Footer>
      </Modal>
    </>
  );
}

export default Curso;
