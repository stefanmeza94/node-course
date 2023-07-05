const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({ status: 'success', data: { tour } });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id;
  let updatedTourIndex = tours.findIndex((tour) => tour.id === id);

  if (updatedTourIndex === -1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  const updatedTour = { ...tours[updatedTourIndex] };

  for (const [key, value] of Object.entries(req.body)) {
    updatedTour[key] = value;
  }

  tours[updatedTourIndex] = updatedTour;

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          message: 'An error occured while updating the tour',
        });
      }
      res.status(200).json({
        status: 'success',
        message: 'You successfully updated the tour',
        data: {
          tour: updatedTour,
        },
      });
    }
  );
});

app.delete('/api/v1/tours/:id', (req, res) => {
  const id = +req.params.id;
  const restOfTheTours = tours.slice().filter((tour) => tour.id !== id);

  if (restOfTheTours.length === tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(restOfTheTours),
    (err) => {
      if (err) {
        res.status(500).json({
          status: 'error',
          message: 'An error occured while deleting the tour',
        });
      }
      res.status(200).json({
        status: 'success',
        message: 'You successfully deleted tour',
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// nastavi od 57. Refactoring Our Routes
