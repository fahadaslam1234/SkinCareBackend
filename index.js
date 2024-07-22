const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

require('./src/config/config')(app, express);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Add the recommendation route
const recommendationRouter = require('./src/routes/recommendation');
app.use('/recommend', recommendationRouter);
