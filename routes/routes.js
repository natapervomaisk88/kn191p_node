import Router from "express";
import path from "path";
import news from "../models/news.js";
import methodOverride from "method-override";
import { add_user } from "../controllers/user.controller.js";
import bcrypt from "bcryptjs";
import users from "../models/users.js";
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
      username: req.signedCookies.username,
    });
  })
  .post((req, res) => {
    res.send("<h1>Express POST REQUEST</h1>");
  });

router
  .route("/news")
  .get((req, res) => {
    res.render("news.ejs", {
      title: "News",
      news: news,
      username: req.signedCookies.username,
    });
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
      title: "??????????????????????",
      username: req.signedCookies.username,
    });
  })
  .post(add_user, (req, res) => {
    res.render("index", {
      title: "Index",
      username: req.signedCookies.username,
    });
  });

router
  .route("/login")
  .get((req, res) => {
    res.render("login", { title: "Login" });
  })
  .post(async (req, res) => {
    const { login, password } = req.body;
    let obj = users.find((el) => el.login === login);
    if (obj) {
      const hash = await bcrypt.hashSync(password, obj.salt);
      if (hash === obj.password) {
        req.session.username = obj.name;
        console.log(req.session.username, req.sessionID);
        // res.cookie("username", obj.name, {
        //   maxAge: 3600 * 24, // 1 ??????????
        //   signed: true,
        // });
      }
    }
    res.redirect("/");
  });

router.route("/logout").get((req, res) => {
  if (req.signedCookies.username) res.clearCookie("username");
  res.render("index", {
    title: "Index",
    news: news,
    username: req.signedCookies.username,
  });
});
/*
  /news GET - ???????????????? ?????? ??????????????
  /news POST - ???????????????? ??????????????
  /news/id GET ???????????????? ?????????????? ???? id
  /news/id DELETE ???????????????? ?????????????? ???? id
  */
export default router;
