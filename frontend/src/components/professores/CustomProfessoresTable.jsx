import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomProfessoresTable = ({professores}) => {
  const navigate = useNavigate();

  const sexo = ["Masculino", "Feminino"]
  const formatDate = (input) => {
    const date = new Date(input);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${year}-${month}-${day}`;
  }

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
              <th>Salário</th>
              <th>Formação</th>
            </tr>
          </thead>
          <tbody>
            {
              professores && professores.length > 0
              ?
              professores.map((professor, id) => {
                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/professores/"+ professor[0])}
                    role='button'>
                      <td>{professor[0]}</td>
                      <td>{professor[1]}</td>
                      <td>{professor[2]}</td>
                      <td>{professor[3]}</td>
                      <td>{formatDate(professor[4])}</td>
                      <td>{sexo[professor[5]]}</td>
                      <td>{professor[6]}</td>
                      <td>{professor[7]}</td>
                      <td>{professor[8]}</td>
                      <td>{professor[9]}</td>
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

export default CustomProfessoresTable;
