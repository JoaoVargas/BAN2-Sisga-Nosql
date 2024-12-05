import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomCursosTable = ({cursos}) => {
  const navigate = useNavigate();

  return (
    <>
      <h1 className='mt-5'><center>Cursos</center></h1>
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
              <th>Periodo</th>
              <th>Total de Créditos</th>
              <th>Coordenador</th>
            </tr>
          </thead>
          <tbody>
            {
              cursos && cursos.length > 0
              ?
              cursos.map((curso, id) => {
                  return (
                    <tr 
                    key={id} 
                    onClick={() => navigate("/cursos/"+ curso[0])}
                    role='button'>
                      <td>{curso[0]}</td>
                      <td>{curso[1]}</td>
                      <td>{curso[2]}</td>
                      <td>{curso[3]}</td>
                      <td>{curso[4]}</td>
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

export default CustomCursosTable;
