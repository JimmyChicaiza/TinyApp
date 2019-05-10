const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser())

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

//ALL MY GETs - EVERYTHING THAT THE USER WILL SEE DISPLAY ON THE WEB BROWSER.

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  // maybe remove json form "/urls.json"
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"],
};   
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
    let templateVars = { 
                username: req.cookies["username"],
            }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"],

  };
  res.render("urls_show", templateVars);
});

////ALL MY POST - UPDATES MADE ON THE WEBPAGE. INPUTS THAT i CAN RECEIVE AND WORK ON.

app.get("/urls", (req, res) => {
  let templateVars = { 
      urls: urlDatabase,
      username: req.cookies["username"],
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

//HERE GOES ALL THE POST

app.post("/urls/:longURL/delete", (req, res) => {
  delete urlDatabase[req.params.longURL];
  console.log(urlDatabase);
  res.redirect("/urls");

});

app.post("/urls/:shortURL", (req, res) => {  //**********
  const shortURL = req.params.shortURL;
  const toReplaceId = req.body.newURL; //I need to create a variable that replace urlDatabase.
  urlDatabase[shortURL] = toReplaceId;

  //console.log({ urlDatabase }); //to console.log ({}) to see the full object.
  // var urlDatabase = {
  //     "b2xVn2": "http://www.lighthouselabs.ca",
  //     "9sm5xK": "http://www.google.com",
  //     }

  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
const longUrl = req.body.longURL;
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id", (req, res) => {
  //POST to update the URL resource
console.log(req.body);
res.send("Ok");
});

app.post("/login", (req,res) => {

res.cookie("username", req.body.username);
res.redirect("/urls");
});

// ALL MY LISTEN TO SEE IF THE PROGRAM WORKS.

app.listen(PORT, () => {
console.log(`Example app listening on port ${PORT}!`);
});

