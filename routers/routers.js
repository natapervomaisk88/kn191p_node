import Router from "express";
import path from "path";
import news from "../models/news.js";
import ejs from "ejs";
const __dirname = path.resolve();
const router = Router();
router
  .route("/")
  .get((req, res) => {
    //res.sendFile(path.resolve(__dirname, "views", "index.html"));
    res.format([
      {
        html: res.render("index.ejs", { title: "My Express (ejs)" }),
      },
    ]);
  })
  .post((req, res) => {
    res.send("<h1>Express POST REQUEST</h1>");
  });

router
  .route("/news")
  .get((req, res) => {
    res.send(news);
  })
  .post((req, res) => {
    news.push({
      title: req.body.title,
      text: req.body.text,
    });
    res.redirect("/news");
  });

router.route("/news/:id").get((req, res) => {
  res.send(news[req.params.id - 1]);
});

/*
  /news GET - получить все новости
  /news POST - создание новости
  /news/id GET получить новость по id
  /news/id DELETE удаление новости по id
  */
export default router;
