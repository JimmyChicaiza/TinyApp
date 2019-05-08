var express = require("express");
var app = express();
var PORT = 8080; // default port 8080

function generateRandomString() {                                        //my function ramdom numbers
    console.log(Math.random().toString(35).replace('0.', '') );
    }
    generateRandomString();
    




app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => { // maybe remove json form "/urls.json"
    let templateVars = { urls: urlDatabase, }; //keys is urls: this is the key
    res.render("urls_index", templateVars);
  });
  
  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

  app.get("/urls/:shortURL", (req, res) => {
    let templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL };
    res.render("urls_show", templateVars);

  });
  
//   app.get("/urls", (req, res) => {
//     let templateVars = { urls: urlDatabase };
//     res.render("urls_index", templateVars);
//   });

  app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  app.post("/urls", (req, res) => {
    console.log(req.body);  // Log the POST request body to the console
    res.send("Ok");         // Respond with 'Ok' (we will replace this)
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

