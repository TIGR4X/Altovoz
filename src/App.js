import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import { CardContent, Typography } from '@mui/material';
import History from './History'; // Nueva página para recomendaciones e historial
import Progress from './Progress'; // Importar la nueva página de control semanal
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const App = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    addiction: '',
    goal: '',
    motive: '',
    physicalSymptoms: '',
    emotionalSymptoms: '',
  });
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const navigate = useNavigate(); // Usar useNavigate

  useEffect(() => {
    if (transcript) {
      if (step === 1) setUserData({ ...userData, name: transcript });
      if (step === 2) setUserData({ ...userData, age: transcript });
      if (step === 3) setUserData({ ...userData, addiction: transcript });
      if (step === 4) setUserData({ ...userData, goal: transcript });
      if (step === 5) setUserData({ ...userData, motive: transcript });
      if (step === 6) setUserData({ ...userData, physicalSymptoms: transcript });
      if (step === 7) setUserData({ ...userData, emotionalSymptoms: transcript });
    }
  }, [transcript, step]);

  const startRecognition = () => {
    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
    };

    recognition.onspeechend = () => {
      setIsListening(false);
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error('Error en el reconocimiento de voz:', event.error);
    };

    recognition.start();
  };

  const callLlamaAPI = async () => {
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    const apiKey = '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';

    const data = {
      messages: [
        {
          role: 'user',
          content: `Quiero dejar mi adicción a ${userData.addiction}. Mi motivo es: ${userData.motive}. Los síntomas físicos que experimento son: ${userData.physicalSymptoms}. Los síntomas emocionales que experimento son: ${userData.emotionalSymptoms}. Mi meta es dejarlo en ${userData.goal}. ¿Qué recomendaciones me das?`
        }
      ],
      model: 'mixtral-8x7b-32768'
    };

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
      });
      setResponse(response.data.choices[0].message.content);
      // Redirigir a la página de recomendaciones, pasando los datos
      navigate('/history', { state: { userData, response: response.data.choices[0].message.content } });
    } catch (error) {
      console.error('Error llamando a la API de Llama:', error);
    }
  };

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
    if (step === 7) callLlamaAPI(); // Llamamos a la API cuando ya se han recopilado todos los datos
  };

  const stepText = () => {
    switch (step) {
      case 1:
        return "Vamos a empezar. Por favor, dime tu nombre.";
      case 2:
        return "Ahora dime, ¿cuántos años tienes?";
      case 3:
        return "¿Cuál es la adicción que deseas superar? Por ejemplo, 'alcohol' o 'procrastinación'.";
      case 4:
        return "¿En cuánto tiempo deseas superar esta adicción? Por ejemplo, '3 meses' o '6 meses'.";
      case 5:
        return "¿Cuál es el motivo principal por el que quieres dejar esta adicción?";
      case 6:
        return "Describe cómo esta adicción afecta tu cuerpo. Por ejemplo, 'me siento cansado', 'tengo dolores'.";
      case 7:
        return "Finalmente, ¿cómo te afecta emocionalmente esta adicción? Por ejemplo, 'me siento triste', 'me siento ansioso'.";
      default:
        return "";
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <CardContent>
              <Typography variant="h4" align="center" gutterBottom>
                Programa de Apoyo para Superar Adicciones
              </Typography>

              <ProgressBar now={(step / 7) * 100} className="my-3" />

              <Typography variant="h6" align="center">
                {stepText()}
              </Typography>

              <div className="text-center my-3">
                <Button onClick={startRecognition} disabled={isListening} variant="primary">
                  {isListening ? 'Escuchando...' : 'Iniciar Reconocimiento de Voz'}
                </Button>
              </div>

              <Typography variant="body1" align="center" className="mb-4">
                {transcript && <span>Transcripción: {transcript}</span>}
              </Typography>

              <div className="text-center">
                {step < 7 && (
                  <Button onClick={nextStep} variant="success">
                    Siguiente Paso
                  </Button>
                )}
                {step === 7 && (
                  <Button onClick={callLlamaAPI} variant="info">
                    Consultas y Recomendaciones
                  </Button>
                )}
              </div>

              {response && (
                <Card className="mt-4">
                  <CardContent>
                    <Typography variant="h5" align="center" color="textPrimary">
                      Recomendación de Llama-3:
                    </Typography>
                    <Typography variant="body1" align="center">
                      {response}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const Main = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/history" element={<History />} /> {/* Nueva ruta para historial */}
      <Route path="/progress" element={<Progress />} /> {/* Nueva ruta para control semanal */}
    </Routes>
  </Router>
);

export default Main;