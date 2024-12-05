import React, { useEffect, useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import CustomProfessoresTable from '../../components/professores/CustomProfessoresTable';

const Professores = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');

  const [professores, setProfessores] = useState([]);
  const [professorCpf, setProfessorCpf] = useState('');
  const [professorNome, setProfessorNome] = useState('');
  const [professorEmail, setProfessorEmail] = useState('');
  const [professorData, setProfessorData] = useState('');
  const [professorSexo, setProfessorSexo] = useState(0);
  const [professorCep, setProfessorCep] = useState('');
  const [professorCel, setProfessorCel] = useState('');
  const [professorSalario, setProfessorSalario] = useState('');
  const [professorFormacao, setProfessorFormacao] = useState('');
  
  const [modalCriar, setModalCriar] = useState(false);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/professorespessoas', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataProfessores) => {
      console.log(dataProfessores);
      setProfessores(dataProfessores);
    })
  }, []);

 const handleCriar = (e) => {
  event.preventDefault();

  fetch('http://0.0.0.0:5002/professorespessoas', { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "cpf": professorCpf,
      "nome": professorNome,
      "email": professorEmail,
      "data_nascimento": professorData,
      "sexo": professorSexo,
      "cep": professorCep,
      "telefone": professorCel,
      "salario": professorSalario,
      "formacao": professorFormacao
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
      <CustomProfessoresTable professores={professores}/>
      <Container
      className='d-flex flex-row mt-3'>
        <Button
        onClick={() => setModalCriar(true)}>
          Criar Professor Novo
        </Button>
      </Container>

      <Modal 
      show={modalCriar} 
      onHide={() => setModalCriar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleCriar(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Professor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorCpf}
                onChange={(e) => setProfessorCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorNome}
                onChange={(e) => setProfessorNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorEmail}
                onChange={(e) => setProfessorEmail(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="data">
                <Form.Label>Data de nascimento:</Form.Label>
                <Form.Control 
                type="date" 
                value={professorData}
                onChange={(e) => setProfessorData(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="sexo">
                <Form.Label>Sexo:</Form.Label>
                <Form.Select onChange={(e) => setProfessorSexo(e.target.value)} defaultValue={professorSexo}>
                  <option value="0">Masculino</option>
                  <option value="1">Feminino</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cep">
                <Form.Label>Cep:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorCep}
                onChange={(e) => setProfessorCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorCel}
                onChange={(e) => setProfessorCel(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="salario">
                <Form.Label>Salario:</Form.Label>
                <Form.Control 
                type="number" 
                min={"0.00"}
                step={"0.01"}
                value={professorSalario}
                onChange={(e) => setProfessorSalario(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formacao">
                <Form.Label>Formação:</Form.Label>
                <Form.Control 
                type="text" 
                value={professorFormacao}
                onChange={(e) => setProfessorFormacao(e.target.value)}/>
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
    </>
  );
}

export default Professores;
