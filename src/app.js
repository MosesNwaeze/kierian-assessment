const express = require('express');
const helmet = require("helmet");
const route = require("./routes/app-routers.js");
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("/api/v1",route);

const port = process.env.SERVER_PORT || 5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
