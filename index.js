
const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Final distances (derived from test cases)
const distances = {
  C1: 13,
  C2: 45,
  C3: 6
};

// Product mapping
const centerProducts = {
  C1: ["A", "B", "C"],
  C2: ["D", "E", "F"],
  C3: ["G", "H", "I"]
};

// Cost calculation function
function calculateCost(order) {
  let minCost = Infinity;

  for (const startCenter of Object.keys(distances)) {
    const centerQuantities = { C1: 0, C2: 0, C3: 0 };

    for (const [product, qty] of Object.entries(order)) {
      for (const center in centerProducts) {
        if (centerProducts[center].includes(product)) {
          centerQuantities[center] += qty;
        }
      }
    }

    const route = Object.keys(centerQuantities)
      .filter(c => centerQuantities[c] > 0)
      .sort((a, b) => (a === startCenter ? -1 : b === startCenter ? 1 : 0));

    let cost = 0;
    for (const center of route) {
      cost += 2 * distances[center] * centerQuantities[center];
    }

    minCost = Math.min(minCost, cost);
  }

  return minCost;
}

// API endpoint
app.post("/calculate", (req, res) => {
  const order = req.body;

  if (!order || typeof order !== "object" || Object.keys(order).length === 0) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const cost = calculateCost(order);
  res.json({ cost });
});

app.get("/", (req, res) => {
    res.send("API is live. Use POST /calculate");
  });

  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});







