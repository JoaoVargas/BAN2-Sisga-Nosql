import React, { useState } from 'react';

import CustomNavbar from '../../components/CustomNavbar';

const Null = () => {
  const [showToast, setShowToast] = useState(false);
  const [messageToast, setMessageToast] = useState('');
  const [variantToast, setVariantToast] = useState('');

  return (
    <>
    <CustomNavbar 
    showToast={showToast} 
    setShowToast={setShowToast}
    messageToast={messageToast} 
    setMessageToast={setMessageToast}
    variantToast={variantToast} 
    setVariantToast={setVariantToast}
    />
    <div 
    style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <h1>
        Esta pagina não existe
      </h1>
    </div>
      
    </>
  );
}

export default Null;
