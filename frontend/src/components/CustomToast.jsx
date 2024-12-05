import React, { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const CustomToast = ( {showToast, setShowToast, messageToast, variantToast} ) => {
  return (
    <>
    <ToastContainer 
    position={'top-end'}
    style={{ 
      zIndex: 1, 
      marginRight: "1rem",
      marginTop: "1rem",
      position: "fixed"
    }} >
      <Toast 
      onClose={() => setShowToast(false)} 
      show={showToast} 
      delay={2000} 
      autohide
      bg={variantToast}>
        <Toast.Body>{messageToast}</Toast.Body>
      </Toast>
    </ToastContainer>
    </>
  );
}

export default CustomToast;
