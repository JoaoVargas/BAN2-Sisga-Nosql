import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomNavbar from '../../components/CustomNavbar.jsx';
import { Button, Card, Container, Modal, Form } from 'react-bootstrap';

const Coordenador = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');


  const [coordenador, setCoordenador] = useState([]);
  const [coordenadorCod, setCoordenadorCod] = useState('');
  const [coordenadorCpf, setCoordenadorCpf] = useState('');
  const [coordenadorNome, setCoordenadorNome] = useState('');
  const [coordenadorEmail, setCoordenadorEmail] = useState('');
  const [coordenadorData, setCoordenadorData] = useState('');
  const [coordenadorSexo, setCoordenadorSexo] = useState(0);
  const [coordenadorCep, setCoordenadorCep] = useState('');
  const [coordenadorCel, setCoordenadorCel] = useState('');
  const [coordenadorSalario, setCoordenadorSalario] = useState('');

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  let { cod_coordenador } = useParams();

  useEffect(() => {
    fetch('http://0.0.0.0:5002/coordenadorespessoas/' + cod_coordenador, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataCoordenador) => {
      console.log(dataCoordenador[0]);
      setCoordenador(dataCoordenador[0])
      setCoordenadorCod(dataCoordenador[0][0])
      setCoordenadorCpf(dataCoordenador[0][1])
      setCoordenadorNome(dataCoordenador[0][2])
      setCoordenadorEmail(dataCoordenador[0][3])
      setCoordenadorData(formatDateVar(dataCoordenador[0][4]))
      setCoordenadorSexo(dataCoordenador[0][5])
      setCoordenadorCep(dataCoordenador[0][6])
      setCoordenadorCel(dataCoordenador[0][7])
      setCoordenadorSalario(dataCoordenador[0][8])
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

    fetch('http://0.0.0.0:5002/coordenadorespessoas/' + coordenador[0], { 
      method: 'PUT',
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
      if (e.message) {
        setShowToast(true)
        setMessageToast("Coordenador atualizado com sucesso")
        setVariantToast('success')
        navigate(0)
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao atualizar coordenador')
        setVariantToast('danger')
      }
    })
    
  }

  const handleExcluir = () => {
    fetch('http://0.0.0.0:5002/coordenadores/' + coordenador[0], { 
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
        setMessageToast("Coordenador excluido com sucesso")
        setVariantToast('success')
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao excluir coordenador')
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
          <Card.Header className="text-center">Coordenador {coordenadorCod}</Card.Header>
          <Card.Body>
            {/* <Card.Title></Card.Title> */}
            <div
            className='d-flex flex-row justify-content-around'>
              <div 
              className='d-flex flex-column'>
                <p> <b>Cpf:</b> {coordenador[1]} </p>
                <p> <b>Nome:</b> {coordenador[2]} </p>
                <p> <b>Email:</b> {coordenador[3]} </p>
                <p> <b>Nascimento:</b> {formatDate(coordenador[4])} </p>
              </div>
              <div 
              className='d-flex flex-column'>
                <p> <b>Sexo:</b> {sexo[coordenador[5]]} </p>
                <p> <b>Cep:</b> {coordenador[6]} </p>
                <p> <b>Celular:</b> {coordenador[7]} </p>
                <p> <b>Salario:</b> {coordenador[8]} </p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div
        className='d-flex flex-row justify-content-around mt-3'>
          <Button
          onClick={() => setModalEditar(true)}>
            Editar Coordenador
          </Button>
          <Button 
          variant='danger'
          onClick={() => setModalExcluir(true)}>
            Excluir Coordenador
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
            <Modal.Title>Editar Coordenador {coordenadorCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorCpf}
                onChange={(e) => setCoordenadorCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorNome}
                onChange={(e) => setCoordenadorNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
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
                <Form.Label>Cep</Form.Label>
                <Form.Control 
                type="text" 
                value={coordenadorCep}
                onChange={(e) => setCoordenadorCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular</Form.Label>
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
            <Modal.Title>Excluir Coordenador {coordenadorCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Você tem certeza que deseja excluir esse coordenador?
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

export default Coordenador;
