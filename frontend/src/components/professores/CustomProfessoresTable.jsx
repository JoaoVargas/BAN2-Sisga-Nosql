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

  // {
  //   "cep": "99704314",
  //   "cod_professor": "1",
  //   "cpf": "69503446007",
  //   "data_nascimento": "07/07/1978",
  //   "email": "raul_carlos_castro@gruposimoes.com.br",
  //   "formacao": "Mestre",
  //   "nome": "Raul Carlos Eduardo Castro",
  //   "salario": "12000",
  //   "sexo": "0",
  //   "telefone": "54993496006"
  // },

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
                    onClick={() => navigate("/professores/"+ professor["cod_professor"])}
                    role='button'>
                      <td>{professor["cod_professor"]}</td>
                      <td>{professor["cpf"]}</td>
                      <td>{professor["nome"]}</td>
                      <td>{professor["email"]}</td>
                      <td>{formatDate(professor["data_nascimento"])}</td>
                      <td>{sexo[professor["sexo"]]}</td>
                      <td>{professor["cep"]}</td>
                      <td>{professor["telefone"]}</td>
                      <td>{professor["salario"]}</td>
                      <td>{professor["formacao"]}</td>
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
