import React, { useEffect, useState } from 'react';

import { Card } from 'react-bootstrap';

const CardNumeroTotal = ({valor}) => {
  return (
    <Card className="text-center">
      <Card.Header>Total de {valor.titulo}</Card.Header>
      <Card.Body>
        <Card.Title>{valor.total}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default CardNumeroTotal;
