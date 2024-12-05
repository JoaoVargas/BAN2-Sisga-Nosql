import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomNavbar from '../../components/CustomNavbar.jsx';
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';

const Professor = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');


  const [professor, setProfessor] = useState([]);
  const [professorCod, setProfessorCod] = useState('');
  const [professorCpf, setProfessorCpf] = useState('');
  const [professorNome, setProfessorNome] = useState('');
  const [professorEmail, setProfessorEmail] = useState('');
  const [professorData, setProfessorData] = useState('');
  const [professorSexo, setProfessorSexo] = useState(0);
  const [professorCep, setProfessorCep] = useState('');
  const [professorCel, setProfessorCel] = useState('');
  const [professorSalario, setProfessorSalario] = useState('');
  const [professorFormacao, setProfessorFormacao] = useState('');

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  let { cod_professor } = useParams();

  useEffect(() => {
    fetch('http://0.0.0.0:5002/professorespessoas/' + cod_professor, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataProfessor) => {
      console.log(dataProfessor[0]);
      setProfessor(dataProfessor[0])
      setProfessorCod(dataProfessor[0][0])
      setProfessorCpf(dataProfessor[0][1])
      setProfessorNome(dataProfessor[0][2])
      setProfessorEmail(dataProfessor[0][3])
      setProfessorData(formatDateVar(dataProfessor[0][4]))
      setProfessorSexo(dataProfessor[0][5])
      setProfessorCep(dataProfessor[0][6])
      setProfessorCel(dataProfessor[0][7])
      setProfessorSalario(dataProfessor[0][8])
      setProfessorFormacao(dataProfessor[0][9])
    })
  }, []);

  const sexo = ["Masculino", "Feminino"]
  const formatDate = (input) => {
    const date = new Date(input);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
  const formatDateVar = (input) => {
    const date = new Date(input);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

  const handleEdit = (event) => {
    event.preventDefault();

    fetch('http://0.0.0.0:5002/professorespessoas/' + professor[0], { 
      method: 'PUT',
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
      if (e.message) {
        setShowToast(true)
        setMessageToast("Professor atualizado com sucesso")
        setVariantToast('success')
        navigate(0)
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao atualizar professor')
        setVariantToast('danger')
      }
    })
    
  }

  const handleExcluir = () => {
    fetch('http://0.0.0.0:5002/professores/' + professor[0], { 
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((e) => {
      if (e.message) {
        navigate('/professores')
        setShowToast(true)
        setMessageToast("Professor excluido com sucesso")
        setVariantToast('success')
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao excluir professor')
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
          <Card.Header className="text-center">Professor {professorCod}</Card.Header>
          <Card.Body>
            {/* <Card.Title></Card.Title> */}
            <div
            className='d-flex flex-row justify-content-around'>
              <div 
              className='d-flex flex-column'>
                <p> <b>Cpf:</b> {professor[1]} </p>
                <p> <b>Nome:</b> {professor[2]} </p>
                <p> <b>Email:</b> {professor[3]} </p>
                <p> <b>Nascimento:</b> {formatDate(professor[4])} </p>
                <p> <b>Sexo:</b> {sexo[professor[5]]} </p>
              </div>
              <div 
              className='d-flex flex-column'>
                <p> <b>Cep:</b> {professor[6]} </p>
                <p> <b>Celular:</b> {professor[7]} </p>
                <p> <b>Salario:</b> {professor[8]} </p>
                <p> <b>Formação:</b> {professor[9]} </p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div
        className='d-flex flex-row justify-content-around mt-3'>
          <Button
          onClick={() => setModalEditar(true)}>
            Editar Professor
          </Button>
          <Button 
          variant='danger'
          onClick={() => setModalExcluir(true)}>
            Excluir Professor
          </Button>
        </div>
      </Container>
      <Modal 
      show={modalEditar} 
      onHide={() => setModalEditar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleEdit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Professor {professorCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf</Form.Label>
                <Form.Control 
                type="text" 
                value={professorCpf}
                onChange={(e) => setProfessorCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                type="text" 
                value={professorNome}
                onChange={(e) => setProfessorNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
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
                <Form.Label>Cep</Form.Label>
                <Form.Control 
                type="text" 
                value={professorCep}
                onChange={(e) => setProfessorCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular</Form.Label>
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
            <Modal.Title>Excluir Professor {professorCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Você tem certeza que deseja excluir esse professor?
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

export default Professor;
