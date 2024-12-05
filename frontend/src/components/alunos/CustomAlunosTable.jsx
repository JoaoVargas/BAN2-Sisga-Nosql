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
                  const date = new Date(aluno["pessoa"]["data_nascimento"]);
                  const day = String(date.getUTCDate()).padStart(2, '0');
                  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Os meses são de 0 a 11, então adicionamos 1
                  const year = date.getUTCFullYear();
                  const nasc = `${day}/${month}/${year}`;
                  const sexo = ["Masculino", "Feminino"]

                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/alunos/"+ aluno["cod_aluno"])}
                    role='button'>
                      <td>{aluno["cod_aluno"]}</td>
                      <td>{aluno["cpf"]}</td>
                      <td>{aluno["pessoa"]["nome"]}</td>
                      <td>{aluno["pessoa"]["email"]}</td>
                      <td>{nasc}</td>
                      <td>{sexo[aluno["pessoa"]["sexo"]]}</td>
                      <td>{aluno["pessoa"]["cep"]}</td>
                      <td>{aluno["pessoa"]["telefone"]}</td>
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
