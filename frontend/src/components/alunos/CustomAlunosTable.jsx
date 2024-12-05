import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomAlunosTable = ({alunos}) => {
  const navigate = useNavigate();

  return (
    <>
      <Container 
      className='mt-5 p-0 rounded-3 overflow-hidden border border-3'>
        <Table 
        striped 
        borderless 
        hover
        responsive
        size='sm'
        className='m-0 '>
          <thead>
            <tr>
              <th>Código</th>
              <th>CPF</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Nascimento</th>
              <th>Sexo</th>
              <th>Cep</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {
              alunos && alunos.length > 0
              ?
              alunos.map((aluno, id) => {
                  const date = new Date(aluno[4]);
                  const day = String(date.getUTCDate()).padStart(2, '0');
                  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Os meses são de 0 a 11, então adicionamos 1
                  const year = date.getUTCFullYear();
                  const nasc = `${day}/${month}/${year}`;
                  const sexo = ["Masculino", "Feminino"]

                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/alunos/"+ aluno[0])}
                    role='button'>
                      <td>{aluno[0]}</td>
                      <td>{aluno[1]}</td>
                      <td>{aluno[2]}</td>
                      <td>{aluno[3]}</td>
                      <td>{nasc}</td>
                      <td>{sexo[aluno[5]]}</td>
                      <td>{aluno[6]}</td>
                      <td>{aluno[7]}</td>
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
      </Container>
    </>
  );
}

export default CustomAlunosTable;
