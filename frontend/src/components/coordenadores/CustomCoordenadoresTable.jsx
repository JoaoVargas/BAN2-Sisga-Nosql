import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomCoordenadoresTable = ({coordenadores}) => {
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
      <h1 className='mt-5'><center>Coordenadores</center></h1>
      <Container 
      className='mt-3 p-0 rounded-3 overflow-hidden border border-3'>
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
            </tr>
          </thead>
          <tbody>
            {
              coordenadores && coordenadores.length > 0
              ?
              coordenadores.map((coordenador, id) => {
                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/coordenadores/"+ coordenador[0])}
                    role='button'>
                      <td>{coordenador[0]}</td>
                      <td>{coordenador[1]}</td>
                      <td>{coordenador[2]}</td>
                      <td>{coordenador[3]}</td>
                      <td>{formatDate(coordenador[4])}</td>
                      <td>{sexo[coordenador[5]]}</td>
                      <td>{coordenador[6]}</td>
                      <td>{coordenador[7]}</td>
                      <td>{coordenador[8]}</td>
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

export default CustomCoordenadoresTable;
