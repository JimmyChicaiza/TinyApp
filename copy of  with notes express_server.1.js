const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session')


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["qwerty",""],
 }));

var PORT = 8080; // default port 8080

function generateRandomString() {
  return Math.random()
    .toString(36)
    .substring(2, 8);
}

// var urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

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
//URLS DATABASE

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
  
};

//function to create a new user;
const addNewUser = (email, password) => { //****************
  const id = generateRandomString();
  const newUserObj = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  usersDb[id] = newUserObj;
  //console.log(newUserObj);
  return id;
};

function findUser(email) {
  for (var userIdKey in usersDb){
    if (email === usersDb[userIdKey].email) {
      return usersDb[userIdKey];
      } 
  }
  return false;
};

//FUNTION TO RETURN USERS WEBSITES

function urlsForUser(id){
const userUrls = {};
for (const urlLoop in urlDatabase){
 if (urlDatabase[shortURL].userID === id) {
  urlDb[urlLoop] = urlDatabase[urlLoop];
  }
}
return userUrls;
};


//ALL MY GETs - EVERYTHING THAT THE USER WILL SEE DISPLAY ON THE WEB BROWSER.

app.get("/", (req, res) => {
  res.send("Hello!"); // this is a simple string
});

app.get("/urls", (req, res) => {
  // maybe remove json form "/urls.json"
  let templateVars = {
    urls: urlDatabase,
   // username: req.cookies["username"],
    user: usersDb[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {   //****************
 
 const user = usersDb[req.session.user_id]
 if (!user) {
   res.redirect("/login"); 
 return ;
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
   // username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

////ALL MY GETS - UPDATES MADE ON THE WEBPAGE. INPUTS THAT i CAN RECEIVE AND WORK ON.

//GET WITH LOGIN PAGE.
app.get("/login", (req, res) => {
  res.render("login");
});

//GET WITH URLs DATABASE.
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

//get register end point
app.get("/register", (req, res) => {   
  const userID = req.session.user_id; //getting the user_id from the cookies
  const templateVars = {
    user: usersDb[userID],
  }
  res.render("register", templateVars);
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
//POST WITH REGISTRATION FOR NEW USERS ID
app.post("/register", (req, res) => {
  const { email, password } = req.body;
  //if email and passwords are empty return error 400 status code
  if (email.length === 0 || password.length === 0) {
    res.status(400).send("WOWOWOWOWOWOW! YOU FORGOT SOMETHING.");
    return;
  }
  const userId = addNewUser(email, password);
  res.cookie("user_id", userId);
  res.redirect("/urls");
  // console.log(userId);
});

app.post("/login", (req, res) => {
  // res.cookie("username", req.body.username); ///======================
  // make and if statement. 
  const { email, password } = req.body; //this password viet directement form de text. 
  //autenticate
  const user = findUser(req.body.email);
 
if (user && bcrypt.compareSync(password, user.password)){ 
 //if (user && user.password === password){
     // plus besoin / res.cookie("user_id", user.id) 
     req.session.user_id = user.id;                 //**********************************************
      res.redirect("/urls");
    } else {
      res.status(403).send("Email or Password is invalid");
   }
});

app.post("/logout", (req, res) => {
 // res.clearCookie("username");
 req.session = null; 
 res.redirect("/");
});

// ALL MY LISTEN TO SEE IF THE PROGRAM WORKS.

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
