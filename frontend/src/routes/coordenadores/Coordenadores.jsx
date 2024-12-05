import React, { useEffect, useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomCoordenadoresTable from '../../components/coordenadores/CustomCoordenadoresTable';
import CustomCursosTable from '../../components/coordenadores/CustomCursosTable';

const Coordenadores = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');

  const [coordenadores, setCoordenadores] = useState([]);
  const [coordenadorCpf, setCoordenadorCpf] = useState('');
  const [coordenadorNome, setCoordenadorNome] = useState('');
  const [coordenadorEmail, setCoordenadorEmail] = useState('');
  const [coordenadorData, setCoordenadorData] = useState('');
  const [coordenadorSexo, setCoordenadorSexo] = useState(0);
  const [coordenadorCep, setCoordenadorCep] = useState('');
  const [coordenadorCel, setCoordenadorCel] = useState('');
  const [coordenadorSalario, setCoordenadorSalario] = useState('');

  const [cursos, setCursos] = useState([]);
  const [cursoNome, setCursoNome] = useState('');
  const [cursoPeriodo, setCursoPeriodo] = useState('m');
  const [cursoCreditos, setCursoCreditos] = useState(1);
  const [cursoCoordenador, setCursoCoordenador] = useState(0);
  
  const [modalCriar, setModalCriar] = useState(false);
  const [modalCriarCurso, setModalCriarCurso] = useState(false);

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

  useEffect(() => {
    fetch('http://0.0.0.0:5002/coordenadorescursos', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataCursos) => {
      console.log(dataCursos);
      setCursos(dataCursos);
    })
  }, []);

 const handleCriar = (e) => {
  event.preventDefault();

  fetch('http://0.0.0.0:5002/coordenadorespessoas', { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "cpf": coordenadorCpf,
      "nome": coordenadorNome,
      "email": coordenadorEmail,
      "data_nascimento": coordenadorData,
      "sexo": coordenadorSexo,
      "cep": coordenadorCep,
      "telefone": coordenadorCel,
      "salario": coordenadorSalario
    })
  })
  .then((res) => res.json())
  .then((e) => {
    console.log(e);
    navigate(0)   
  })
 }

 const handleCriarCurso = (e) => {
  event.preventDefault();

  fetch('http://0.0.0.0:5002/cursos', { 
    method: 'POST',
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
    console.log(e);
    navigate(0)   
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
      

      <CustomCoordenadoresTable coordenadores={coordenadores}/>
      <Container
      className='d-flex flex-row mt-3'>
        <Button
        onClick={() => setModalCriar(true)}>
          Criar Coordenador Novo
        </Button>
      </Container>
      
      <CustomCursosTable cursos={cursos}/>
      <Container
      className='d-flex flex-row mt-3'>
        <Button
        onClick={() => setModalCriarCurso(true)}>
          Criar Curso Novo
        </Button>
      </Container>

      <Modal 
      show={modalCriar} 
      onHide={() => setModalCriar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleCriar(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Coordenador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf:</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorCpf}
                onChange={(e) => setCoordenadorCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome:</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorNome}
                onChange={(e) => setCoordenadorNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorEmail}
                onChange={(e) => setCoordenadorEmail(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="data">
                <Form.Label>Data de nascimento:</Form.Label>
                <Form.Control 
                type="date" 
                value={coordenadorData}
                onChange={(e) => setCoordenadorData(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="sexo">
                <Form.Label>Sexo:</Form.Label>
                <Form.Select onChange={(e) => setCoordenadorSexo(e.target.value)} defaultValue={coordenadorSexo}>
                  <option value="0">Masculino</option>
                  <option value="1">Feminino</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cep">
                <Form.Label>Cep:</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorCep}
                onChange={(e) => setCoordenadorCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular:</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorCel}
                onChange={(e) => setCoordenadorCel(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="salario">
                <Form.Label>Salario:</Form.Label>
                <Form.Control 
                type="number" 
                min={"0.00"}
                step={"0.01"}
                value={coordenadorSalario}
                onChange={(e) => setCoordenadorSalario(e.target.value)}/>
              </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalCriar(false)}>
              Fechar
            </Button>
            <Button type="submit" variant="primary" onClick={() => setModalCriar(false)}>
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal 
      show={modalCriarCurso} 
      onHide={() => setModalCriarCurso(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleCriarCurso(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Coordenador</Modal.Title>
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
            <Button variant="secondary" onClick={() => setModalCriarCurso(false)}>
              Fechar
            </Button>
            <Button type="submit" variant="primary" onClick={() => setModalCriarCurso(false)}>
              Salvar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Coordenadores;
