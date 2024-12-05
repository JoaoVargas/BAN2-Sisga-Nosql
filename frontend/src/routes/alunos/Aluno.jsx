import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomNavbar from '../../components/CustomNavbar.jsx';
import { Button, Card, Container, Modal, Form, Col, Row, Table } from 'react-bootstrap';

const Aluno = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');


  const [aluno, setAluno] = useState([]);
  const [alunoCod, setAlunoCod] = useState('');
  const [alunoCpf, setAlunoCpf] = useState('');
  const [alunoNome, setAlunoNome] = useState('');
  const [alunoEmail, setAlunoEmail] = useState('');
  const [alunoData, setAlunoData] = useState('');
  const [alunoSexo, setAlunoSexo] = useState(0);
  const [alunoCep, setAlunoCep] = useState('');
  const [alunoCel, setAlunoCel] = useState('');

  const [historico, sethistorico] = useState([]);
  const [conclusão, setConclusao] = useState(0);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  let { cod_aluno } = useParams();

  useEffect(() => {
    fetch('http://0.0.0.0:5002/historicoescolar/' + cod_aluno, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataHistorico) => {
      console.log(dataHistorico);
      sethistorico(dataHistorico)
    })
  }, []);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/conclusaoescolar/' + cod_aluno, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataConclusao) => {
      console.log(dataConclusao[0][0]);
      setConclusao(dataConclusao[0][0])
    })
  }, []);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/alunospessoas/' + cod_aluno, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((dataAluno) => {
      console.log(dataAluno[0]);
      setAluno(dataAluno[0])
      setAlunoCod(dataAluno[0][0])
      setAlunoCpf(dataAluno[0][1])
      setAlunoNome(dataAluno[0][2])
      setAlunoEmail(dataAluno[0][3])
      setAlunoData(formatDateVar(dataAluno[0][4]))
      setAlunoSexo(dataAluno[0][5])
      setAlunoCep(dataAluno[0][6])
      setAlunoCel(dataAluno[0][7])
    })
  }, []);

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

  const tratarData = (inputArray) => {
    if (!inputArray || !Array.isArray(inputArray)) return null; // Verifica se a entrada é um array válido
    
    return inputArray.map(input => {
        if (!input) return null; // Retorna null para valores nulos ou undefined

        const date = new Date(input);
        if (isNaN(date)) return null; // Verifica se a data é válida
        
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    });
  }
  const sexo = ["Masculino", "Feminino"]

  const handleEdit = (event) => {
    event.preventDefault();

    fetch('http://0.0.0.0:5002/pessoas/' + aluno[1], { 
      method: 'PUT',
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
      if (e.message) {
        setShowToast(true)
        setMessageToast("Aluno atualizado com sucesso")
        setVariantToast('success')
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao atualizar aluno')
        setVariantToast('danger')
      }
    })
    
  }

  const handleExcluir = () => {
    fetch('http://0.0.0.0:5002/pessoas/' + aluno[1], { 
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((e) => {
      if (e.message) {
        navigate('/alunos')
        setShowToast(true)
        setMessageToast("Aluno excluido com sucesso")
        setVariantToast('success')
      }
      else {
        setShowToast(true)
        setMessageToast('Erro ao excluir aluno')
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
          <Card.Header className="text-center">Aluno {alunoCod}</Card.Header>
          <Card.Body>
            {/* <Card.Title></Card.Title> */}
            <div
            className='d-flex flex-row justify-content-around'>
              <div 
              className='d-flex flex-column'>
                <p> <b>Cpf:</b> {aluno[1]} </p>
                <p> <b>Nome:</b> {aluno[2]} </p>
                <p> <b>Email:</b> {aluno[3]} </p>
                <p> <b>Nascimento:</b> {formatDate(aluno[4])} </p>
              </div>
              <div 
              className='d-flex flex-column'>
                <p> <b>Sexo:</b> {sexo[aluno[5]]} </p>
                <p> <b>Cep:</b> {aluno[6]} </p>
                <p> <b>Celular:</b> {aluno[7]} </p>
              </div>
            </div>
          </Card.Body>
        </Card>
        <div
        className='d-flex flex-row justify-content-around mt-3'>
          <Button
          onClick={() => setModalEditar(true)}>
            Editar Aluno
          </Button>
          <Button 
          variant='danger'
          onClick={() => setModalExcluir(true)}>
            Excluir Aluno
          </Button>
        </div>
      </Container>

      <Container className='my-5'>
      <Row xs={1} xl={2} className="g-4">
        <Col>
          <Card className="text-center">
            <Card.Header>Historico Escolar</Card.Header>
            <Card.Body>
              <Table 
              striped 
              borderless 
              hover
              responsive
              size='sm'
              className='m-0 '>
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Disciplina</th>
                    <th>Nome</th>
                    <th>Creditos</th>
                    <th>Notas</th>
                    <th>Frequência</th>
                    <th>Aprovação</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    historico && historico.length > 0
                    ?
                    historico.map((item, id) => {
                        return (
                          <tr 
                          key={id} 
                          role='button'>
                            <td>{item[2]}</td>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                            <td>{item[3]}</td>
                            <td>{item[4] ? item[4].join(', ') : null  || item[6]}</td>
                            <td>{tratarData(item[5]) ? tratarData(item[5]).join(', ') : null || item[7]}</td>
                            <td>{`${item[8]
                                    ? 'aprovado' 
                                    : item[8] == false
                                      ? 'reprovado'
                                      : 'cursando'}`}</td>
                          </tr>
                        )
                      })
                    :
                      <tr>
                        <td>
                          Tabela Vazia
                        </td>
                      </tr>
                  }
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="text-center">
            <Card.Header>Conclusão Escolar</Card.Header>
            <Card.Body>
              <h1>{conclusão > 0
                    ? conclusão.slice(0, 4)
                    : 0 }%</h1>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>

      <Modal 
      show={modalEditar} 
      onHide={() => setModalEditar(false)}
      size="lg"
      centered>
        <Form onSubmit={(e) => handleEdit(e)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Aluno {alunoCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="cpf">
                <Form.Label>Cpf</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCpf}
                onChange={(e) => setAlunoCpf(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoNome}
                onChange={(e) => setAlunoNome(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
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
                <Form.Label>Cep</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCep}
                onChange={(e) => setAlunoCep(e.target.value)}/>
              </Form.Group>

              <Form.Group className="mb-3" controlId="cel">
                <Form.Label>Celular</Form.Label>
                <Form.Control 
                type="text" 
                value={alunoCel}
                onChange={(e) => setAlunoCel(e.target.value)}/>
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
            <Modal.Title>Excluir Aluno {alunoCod}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              Você tem certeza que deseja excluir esse aluno?
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

export default Aluno;
