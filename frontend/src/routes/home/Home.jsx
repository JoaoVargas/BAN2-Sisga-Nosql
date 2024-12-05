import React, { useEffect, useState } from 'react';

import CustomNavbar from '../../components/CustomNavbar';
import CardContainer from '../../components/home/CardContainer';

const Home = () => {
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');

  const [numPessoas, setNumPessoas] = useState(0);
  const [numCoordenadores, setNumCoordenadores] = useState(0);
  const [numProfessores, setNumProfessores] = useState(0);
  const [numAlunos, setNumAlunos] = useState(0);
  const [numCursos, setNumCursos] = useState(0);
  const [numDisciplinas, setNumDisciplinas] = useState(0);
  const [numTurmas, setNumTurmas] = useState(0);
  const [blocos, setBlocos] = useState([]);

  useEffect(() => {
    fetch('http://0.0.0.0:5002/pessoas', { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get pessoas");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumPessoas(data.length);
    
      return fetch('http://0.0.0.0:5002/coordenadores', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get coordenadores");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumCoordenadores(data.length);
    
      return fetch('http://0.0.0.0:5002/professores', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get professores");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumProfessores(data.length);
    
      return fetch('http://0.0.0.0:5002/alunos', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get alunos");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumAlunos(data.length);
    
      return fetch('http://0.0.0.0:5002/cursos', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get cursos");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumCursos(data.length);
    
      return fetch('http://0.0.0.0:5002/disciplinas', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get disciplinas");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumDisciplinas(data.length);
    
      return fetch('http://0.0.0.0:5002/turmas', { 
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    })
    .then((res) => res.json())
    .then((data) => {
      if (!data) {
        setMessageToast("Erro: Get turmas");
        setVariantToast('danger');
        setShowToast(true);
        return;
      }
      setNumTurmas(data.length);
    })
    .catch((error) => {
      setMessageToast("Erro: " + error.message);
      setVariantToast('danger');
      setShowToast(true);
    });
    
    

    
  }, []);

  useEffect(() => {
    setBlocos([
      {
        titulo: "Pessoas",
        total: numPessoas
      },
      {
        titulo: "Coordenadores",
        total: numCoordenadores
      },
      {
        titulo: "Professores",
        total: numProfessores
      },
      {
        titulo: "Alunos",
        total: numAlunos
      },
      {
        titulo: "Cursos",
        total: numCursos
      },
      {
        titulo: "Disciplinas",
        total: numDisciplinas
      },
      {
        titulo: "Turmas",
        total: numTurmas
      },
    ])
  }, [numPessoas, numCoordenadores, numProfessores, numAlunos, numCursos, numDisciplinas, numTurmas]);
  
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
      {
        <CardContainer blocos={blocos}/> 
      }

    </>
  );
}

export default Home;
