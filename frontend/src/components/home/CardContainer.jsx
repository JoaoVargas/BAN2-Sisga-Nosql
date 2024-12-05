import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import CardNumeroTotal from './CardNumeroTotal';

const CardContainer = ( {blocos} ) => {
  return (
    <Container className='my-5'>
      <Row xs={1} md={2} xl={4} className="g-4">
      {
        blocos && blocos.length > 0
        ? blocos.map((bloco, idx) => (
            <Col key={idx}>
              <CardNumeroTotal valor={bloco}/>
            </Col>
          ))
        : "Erro ao cerregar itens"
      }
      </Row>
    </Container>
  );
}

export default CardContainer;
