const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

// app.get('/', (req, res) => {
//     res.send();
// });

app.listen(port, () => {
    console.log(`Server listening at ${port}`);    
});
