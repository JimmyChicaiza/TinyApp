const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

var PORT = 8080; // default port 8080

function generateRandomString() {
  return Math.random()
    .toString(36)
    .substring(2, 8);
}

var urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

//function to create a new user;
const addNewUser = (email, password) => {
  const id = generateRandomString();
  const newUserObj = {
    id,
    email,
    password
  };

  usersDb[id] = newUserObj;
  return id;
};

//ALL MY GETs - EVERYTHING THAT THE USER WILL SEE DISPLAY ON THE WEB BROWSER.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  // maybe remove json form "/urls.json"
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

////ALL MY GETS - UPDATES MADE ON THE WEBPAGE. INPUTS THAT i CAN RECEIVE AND WORK ON.

app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/register", (req, res) => {
  res.render("/register");
});

//HERE GOES ALL THE POST

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
    const userId = addNewUser(email, password);
    res.cookie("user_id", userId);
    res.render("register");
});

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// ALL MY LISTEN TO SEE IF THE PROGRAM WORKS.

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
