const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tours = [
  { id: 0, name: "Hood River", price: 99.99 },
  { id: 1, name: "Oregon Coast", price: 149.95 },
];

// update tour
app.put("/api/tours/:id", (req, res) => {
  const p = tours.find((p) => p.id === parseInt(req.params.id));
  if (!p) return res.status(404).json({ error: "No such tour exists" });
  if (req.body.name) p.name = req.body.name;
  if (req.body.price) p.price = req.body.price;
  res.json({ success: true });
});

// delete tour
app.delete("/api/tours/:id", (req, res) => {
  const idx = tours.findIndex((tour) => tour.id === parseInt(req.params.id));
  if (idx < 0) return res.json({ error: "No such tour exists." });
  tours.splice(idx, 1);
  res.json({ success: true });
});

// search tour by name
app.get("/api/tours/", (req, res, next) => {
  const keyword = req.query.name;
  if (!keyword) {
    next();
  } else {
    const toursFound = tours.filter((tour) => tour.name.startsWith(keyword));
    res.json({
      tours: toursFound,
    });
  }
});

// get all tours
app.get("/api/tours", (req, res) => res.json(tours));

// add new tour
app.post("/api/tours", (req, res) => {
  const id = tours.length;
  const tour = {
    id,
    ...req.body,
  };
  tours.push(tour);
  res.json({
    success: true,
    tour,
  });
});

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at ${port}`);
});
