import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomDisciplinasTable = ({disciplinas}) => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='mt-5'><center>Disciplinas</center></h1>
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
              <th>Nome</th>
              <th>Fase</th>
              <th>Creditos</th>
            </tr>
          </thead>
          <tbody>
            {
              disciplinas && disciplinas.length > 0
              ?
              disciplinas.map((disciplina, id) => {
                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/disciplinas/"+ disciplina[0])}
                    role='button'>
                      <td>{disciplina[0]}</td>
                      <td>{disciplina[1]}</td>
                      <td>{disciplina[2]}</td>
                      <td>{disciplina[3]}</td>
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

export default CustomDisciplinasTable;
