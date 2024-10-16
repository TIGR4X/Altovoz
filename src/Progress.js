import React, { useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { TextField, Typography } from '@mui/material';
import { addProgressRecord } from './db';
import { useNavigate } from 'react-router-dom';

const Progress = () => {
  const [physicalFeelings, setPhysicalFeelings] = useState('');
  const [emotionalFeelings, setEmotionalFeelings] = useState('');
  const [isListening, setIsListening] = useState(false); // Estado para controlar si está escuchando

  const navigate = useNavigate();

  const startRecognition = (setFeeling) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('La API de reconocimiento de voz no es compatible con este navegador.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Definir el idioma

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setFeeling(speechResult);
    };

    recognition.onspeechend = () => {
      setIsListening(false);
      recognition.stop(); // Detener el reconocimiento de voz cuando el usuario deje de hablar
    };

    recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
      setIsListening(false);
    };

    recognition.start(); // Iniciar el reconocimiento
  };

  const submitProgress = async () => {
    const progressRecord = {
      physicalFeelings,
      emotionalFeelings,
      date: new Date().toISOString()
    };
    await addProgressRecord(progressRecord);
    console.log('Progreso enviado:', progressRecord);
    setPhysicalFeelings('');
    setEmotionalFeelings('');
  };

  const handleGoBack = () => {
    navigate(-1); // Esto llevará al usuario a la página anterior
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Typography variant="h5" align="center">Control Semanal de Progreso</Typography>
              <Card.Text>
                <strong>¿Cómo te has sentido físicamente?</strong>
                <TextField
                  fullWidth
                  value={physicalFeelings}
                  placeholder="Ej: He estado cansado, tengo dolores..."
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setPhysicalFeelings(e.target.value)} // Control de entrada
                />
                <Button variant="primary" onClick={() => startRecognition(setPhysicalFeelings)} disabled={isListening}>
                  {isListening ? 'Escuchando...' : 'Usar Reconocimiento de Voz'}
                </Button>
              </Card.Text>
              <Card.Text>
                <strong>¿Cómo te has sentido emocionalmente?</strong>
                <TextField
                  fullWidth
                  value={emotionalFeelings}
                  placeholder="Ej: Me siento ansioso, triste..."
                  variant="outlined"
                  margin="normal"
                  onChange={(e) => setEmotionalFeelings(e.target.value)} // Control de entrada
                />
                <Button variant="primary" onClick={() => startRecognition(setEmotionalFeelings)} disabled={isListening}>
                  {isListening ? 'Escuchando...' : 'Usar Reconocimiento de Voz'}
                </Button>
              </Card.Text>
              <Button variant="success" onClick={submitProgress}>Enviar Progreso</Button>
              <Button variant="secondary" onClick={handleGoBack} className="ml-2">Volver Atrás</Button>
              </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Progress;