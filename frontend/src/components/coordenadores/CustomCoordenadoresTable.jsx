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

  // {
  //   "cod_coordenador": "1",
  //   "cpf": "50313221529",
  //   "pessoa_info": {
  //     "cep": "59135712",
  //     "data_nascimento": "01/03/1976",
  //     "email": "henrique_monteiro@julianacaran.com.br",
  //     "nome": "Henrique Luiz Monteiro",
  //     "sexo": "0",
  //     "telefone": "84985919949"
  //   },
  //   "salario": "15000"
  // },

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
                    onClick={() => navigate("/coordenadores/"+ coordenador["cod_coordenador"])}
                    role='button'>
                      <td>{coordenador["cod_coordenador"]}</td>
                      <td>{coordenador["cpf"]}</td>
                      <td>{coordenador["pessoa_info"]["nome"]}</td>
                      <td>{coordenador["pessoa_info"]["email"]}</td>
                      <td>{formatDate(coordenador["pessoa_info"]["data_nascimento"])}</td>
                      <td>{sexo[coordenador["pessoa_info"]["sexo"]]}</td>
                      <td>{coordenador["pessoa_info"]["cep"]}</td>
                      <td>{coordenador["pessoa_info"]["telefone"]}</td>
                      <td>{coordenador["salario"]}</td>
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
