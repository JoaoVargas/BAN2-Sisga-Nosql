import React, { useEffect, useState } from 'react';
import CustomNavbar from '../../components/CustomNavbar';
import CustomAlunosTable from '../../components/alunos/CustomAlunosTable';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Alunos = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');

  const [alunos, setAlunos] = useState([]);
  const [alunoCpf, setAlunoCpf] = useState('');
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoEmail, setAlunoEmail] = useState('');
  const [alunoData, setAlunoData] = useState('');
  const [alunoSexo, setAlunoSexo] = useState(0  );
  const [alunoCep, setAlunoCep] = useState('');
  const [alunoCel, setAlunoCel] = useState('');
  
  const [modalCriar, setModalCriar] = useState(false);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/alunospessoas', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataAlunos) => {
      console.log(dataAlunos);
      setAlunos(dataAlunos);
    })
  }, []);

 const handleCriar = (e) => {
  event.preventDefault();

  fetch('http://0.0.0.0:5002/alunospessoas', { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "cpf": alunoCpf,
      "nome": alunoNome,
      "email": alunoEmail,
      "data_nascimento": alunoData,
      "sexo": alunoSexo,
      "cep": alunoCep,
      "telefone": alunoCel
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
      <CustomAlunosTable alunos={alunos}/>
      <Container
      className='d-flex flex-row mt-3'>
        <Button
        onClick={() => setModalCriar(true)}>
          Criar Aluno Novo
        </Button>
      </Container>

      <Modal 
      show={modalCriar} 
      onHide={() => setModalCriar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleCriar(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Criar Aluno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf:</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCpf}
                onChange={(e) => setAlunoCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome:</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoNome}
                onChange={(e) => setAlunoNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoEmail}
                onChange={(e) => setAlunoEmail(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="data">
                <Form.Label>Data de nascimento:</Form.Label>
                <Form.Control 
                type="date" 
                value={alunoData}
                onChange={(e) => setAlunoData(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="sexo">
                <Form.Label>Sexo:</Form.Label>
                <Form.Select onChange={(e) => setAlunoSexo(e.target.value)} defaultValue={alunoSexo}>
                  <option value="0">Masculino</option>
                  <option value="1">Feminino</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cep">
                <Form.Label>Cep:</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCep}
                onChange={(e) => setAlunoCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular:</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCel}
                onChange={(e) => setAlunoCel(e.target.value)}/>
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

export default Alunos;
