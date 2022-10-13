import users from "../models/users.js";
export const add_user = (req, res, next) => {
  if (req.body) {
    const { name, surname, login, email, password, repeat_password } = req.body;
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

      console.log(name);
      res.cookie("username", name, {
        maxAge: 60 * 1000, // 1 минута
        signed: true,
      });
    }
  }
  next();
};
