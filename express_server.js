const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["qwerty", ""]
  })
);

var PORT = 8080; // Our default port 8080

function generateRandomString() {
  return Math.random()
    .toString(36)
    .substring(2, 8);
}

const usersDb = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const addNewUser = (email, password) => {
  const id = generateRandomString();
  const newUserObj = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  usersDb[id] = newUserObj;
  return id;
};

function findUser(email) {
  for (var userIdKey in usersDb) {
    if (email === usersDb[userIdKey].email) {
      return usersDb[userIdKey];
    }
  }
  return false;
};

function urlsForUser(id) {
  const userUrls = {};
  for (const urlLoop in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      urlDb[urlLoop] = urlDatabase[urlLoop];
    }
  }
  return userUrls;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: usersDb[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = usersDb[req.session.user_id];
  if (!user) {
    res.redirect("/login");
    return;
  }
  let templateVars = {
    user
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
 
  let templateVars = {
   
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: usersDb[req.session.user_id]

  };
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    urls: urlsForUser(req.session.user_id)
  };
  res.render("/urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const templateVars = {
    user: usersDb[userID]
  };
  res.render("register", templateVars);
});

app.post("/urls/:longURL/delete", (req, res) => {
  delete urlDatabase[req.params.longURL];
  console.log(urlDatabase);
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const toReplaceId = req.body.newURL;
  urlDatabase[shortURL] = toReplaceId;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longUrl = req.body.longURL;
  console.log(req.body);
  res.send("Ok");
});

app.post("/urls/:id", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  if (email.length === 0 || password.length === 0) {
    res
      .status(400)
      .send("Username or password are incorrect, please try again");
    return;
  }
  const userId = addNewUser(email, password);
  res.cookie("user_id", userId);
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUser(req.body.email);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user_id = user.id;
    res.redirect("/urls");
  } else {
    res.status(403).send("Email or Password is invalid");
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

//This is one off the hardest code. I know it is important that I keep practicing. I try to do my best at debugging and finding my errors. Please, advice me where I have make to adjustements. Thanks. Jimmy CHicaiza.