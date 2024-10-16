/*import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { getAllRecords } from './db';
import { useNavigate } from 'react-router-dom';

const RecordHistory = () => {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      const allRecords = await getAllRecords();
      setRecords(allRecords);
    };
    fetchRecords();
  }, []);

  const startNewConsultation = () => {
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <h2>Historial de Consultas</h2>
      {records.map((record, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>{record.name} - {new Date(record.date).toLocaleDateString()}</Card.Title>
            <Card.Text>
              <strong>Adicción:</strong> {record.addiction}<br />
              <strong>Meta:</strong> {record.goal}<br />
              <strong>Recomendación:</strong> {record.aiResponse.substring(0, 100)}...
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
      <Button variant="primary" onClick={startNewConsultation}>Iniciar Nueva Consulta</Button>
    </Container>
  );
}*/
// RecordHistory.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { getAllRecords, getAllProgressRecords } from './db';
import { useNavigate } from 'react-router-dom';

const RecordHistory = () => {
  const [consultations, setConsultations] = useState([]);
  const [progressRecords, setProgressRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      const allConsultations = await getAllRecords();
      const allProgressRecords = await getAllProgressRecords();
      setConsultations(allConsultations);
      setProgressRecords(allProgressRecords);
    };
    fetchRecords();
  }, []);

  const startNewConsultation = () => {
    navigate('/');
  };

  return (
    <Container className="mt-5">
      <h2>Historial de Consultas</h2>
      {consultations.map((record, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>{record.name} - {new Date(record.date).toLocaleDateString()}</Card.Title>
            <Card.Text>
              <strong>Adicción:</strong> {record.addiction}<br />
              <strong>Meta:</strong> {record.goal}<br />
              <strong>Recomendación:</strong> {record.aiResponse.substring(0, 100)}...
            </Card.Text>
          </Card.Body>
        </Card>
      ))}

      <h2 className="mt-5">Registros de Progreso</h2>
      {progressRecords.map((record, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>Registro del {new Date(record.date).toLocaleDateString()}</Card.Title>
            <Card.Text>
              <strong>Sentimientos Físicos:</strong> {record.physicalFeelings}<br />
              <strong>Sentimientos Emocionales:</strong> {record.emotionalFeelings}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}

      <Button variant="primary" onClick={startNewConsultation}>Iniciar Nueva Consulta</Button>
    </Container>
  );
}

export default RecordHistory;