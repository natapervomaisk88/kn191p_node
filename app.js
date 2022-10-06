import express from "express"; //подключили пакет с фреймворком
import path from "path";
import ejs from "ejs";
import bodyParser from "body-parser";
import router from "./routers/routers.js";
const __dirname = path.resolve();
const PORT = process.env.PORT ?? 3000; //определили port
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public"))); //middleware подключение статических данных (js, css, pictures)
app.use(router);
app.listen(PORT, () => {
  console.log(`Server has been started http//localhost:${PORT}`);
});
