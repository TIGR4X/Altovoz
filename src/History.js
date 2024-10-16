import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import { useLocation } from 'react-router-dom';

const History = () => {
  const location = useLocation(); // Usamos useLocation para acceder a la ubicación y el estado
  const { userData, response } = location.state || {}; // Desestructuramos userData y response

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Nombre: ${userData.name}`, 10, 10);
    doc.text(`Edad: ${userData.age}`, 10, 20);
    doc.text(`Adicción: ${userData.addiction}`, 10, 30);
    doc.text(`Meta: ${userData.goal}`, 10, 40);
    doc.text(`Motivo: ${userData.motive}`, 10, 50);
    doc.text(`Síntomas Físicos: ${userData.physicalSymptoms}`, 10, 60);
    doc.text(`Síntomas Emocionales: ${userData.emotionalSymptoms}`, 10, 70);
    doc.text(`Recomendaciones: ${response}`, 10, 80);
    doc.save('recomendaciones.pdf');
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Recomendaciones</Card.Title>
              <Card.Text>
                <strong>Nombre:</strong> {userData.name}<br />
                <strong>Edad:</strong> {userData.age}<br />
                <strong>Adicción:</strong> {userData.addiction}<br />
                <strong>Meta:</strong> {userData.goal}<br />
                <strong>Motivo:</strong> {userData.motive}<br />
                <strong>Síntomas Físicos:</strong> {userData.physicalSymptoms}<br />
                <strong>Síntomas Emocionales:</strong> {userData.emotionalSymptoms}<br />
              </Card.Text>
              <Button variant="success" onClick={downloadPDF}>Descargar Recomendaciones como PDF</Button>
              {/* Añadir un botón para ir al control semanal */}
              <Button variant="info" className="mt-3" href="/progress">Control Semanal</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default History;
