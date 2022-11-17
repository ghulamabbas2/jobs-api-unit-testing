import app from "./app.js";

import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

// Connecting to databse
connectDatabase();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
