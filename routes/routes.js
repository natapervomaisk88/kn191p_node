import Router from "express";
import path from "path";
import news from "../models/news.js";
import users from "../models/users.js";
import methodOverride from "method-override";
import { userInfo } from "os";
const __dirname = path.resolve();
const router = Router();
router.use(methodOverride("X-HTTP-Method")); //          Microsoft
router.use(methodOverride("X-HTTP-Method-Override")); // Google/GData
router.use(methodOverride("X-Method-Override")); //      IBM
router.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
router
  .route("/")
  .get((req, res) => {
    //res.sendFile(path.resolve(__dirname, "views", "index.html"));
    let username = undefined;
    // if (req.cookies && req.cookies.username) {
    //   username = req.cookies.username;
    // }
    res.render("index.ejs", {
      title: "My Express (ejs)",
      news: news,
      username: req.cookies.username,
    });
  })
  .post((req, res) => {
    res.send("<h1>Express POST REQUEST</h1>");
  });

router
  .route("/news")
  .get((req, res) => {
    res.render("news.ejs");
  })
  .post((req, res) => {
    let biggest;
    if (news.length !== 0) {
      biggest = news.reduce((prev, current) =>
        prev.id > current.id ? prev : current
      );
    }
    news.push({
      id: biggest ? biggest.id + 1 : 1,
      title: req.body.title,
      text: req.body.text,
    });
    res.redirect("/");
  });

router
  .route("/news/:id")
  .get((req, res) => {
    console.log("TEST");
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    res.send(obj);
  })
  .delete((req, res) => {
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    if (obj) {
      let i = news.indexOf(obj);
      news.splice(i, 1);
    }
    res.redirect("/");
  })
  .put((req, res) => {
    let obj = news.find((el) => el.id === parseInt(req.params.id));
    if (obj) {
      const { title, text } = req.body;
      obj.title = title;
      obj.text = text;
    }
    res.redirect("/");
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("register", {
      title: "Регистрация",
      username: req.cookies.username,
    });
  })
  .post((req, res) => {
    if (req.body) {
      const { name, surname, login, email, password, repeat_password } =
        req.body;
      if (password === repeat_password) {
        //валидация данных
        let biggest;
        if (users.length !== 0) {
          biggest = users.reduce((prev, current) =>
            prev.id > current.id ? prev : current
          );
        }
        users.push({
          id: biggest ? biggest.id + 1 : 1,
          name: name,
          surname: surname,
          login: login,
          email: email,
          password: password,
        });
        res.cookie("username", name);
        console.log(name);
        res.redirect("/");
      }
    }
  });

router.route("/logout").get((req, res) => {
  if (req.cookies.username) res.clearCookie("username");
  req.redirect("/");
});
/*
  /news GET - получить все новости
  /news POST - создание новости
  /news/id GET получить новость по id
  /news/id DELETE удаление новости по id
  */
export default router;