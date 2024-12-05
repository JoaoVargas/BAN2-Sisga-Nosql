import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';

const CustomCursosTable = ({cursos}) => {
  const navigate = useNavigate();

  // {
  //   "cod_coordenador": "1",
  //   "cod_curso": "1",
  //   "credito_total": "10",
  //   "nome": "Bacharelado em Ciências da Computação",
  //   "periodo": "i"
  // },

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
                    onClick={() => navigate("/cursos/"+ curso["cod_curso"])}
                    role='button'>
                      <td>{curso["cod_curso"]}</td>
                      <td>{curso["nome"]}</td>
                      <td>{curso["periodo"]}</td>
                      <td>{curso["credito_total"]}</td>
                      <td>{curso["pessoa_info"]["nome"]}</td>
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
