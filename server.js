import express, { static as _static } from "express";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(_static("dist"));

app.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
