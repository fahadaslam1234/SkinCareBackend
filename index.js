const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use the recommendation route
const recommendationRouter = require('./src/routes/recommendation');
app.use('/api/recommend', recommendationRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
