const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;
const reservationsFilePath = 'reservations.json';

app.use(cors());
app.use(express.json());

// 예약 데이터 배열 선언
const reservations = [];

// 예약 추가 함수
function addReservation(reservation) {
  reservations.push(reservation);
  saveReservationsToFile();
}

// 파일에 예약 데이터 저장
function saveReservationsToFile() {
  fs.writeFile(reservationsFilePath, JSON.stringify(reservations, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Reservations saved to file');
    }
  });
}

// 예약 POST
app.post('/api/reservations', (req, res) => {
  const reservation = req.body;
  reservation.id = reservations.length + 1;
  addReservation(reservation);
  console.log('New reservation:', reservation);
  res.status(201).json(reservation);
});

// 예약 Get
app.get('/api/reservations', (req, res) => {
  fs.readFile(reservationsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    const reservations = JSON.parse(data);
    res.json(reservations);
  });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});