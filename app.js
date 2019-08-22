const express       = require('express')
const path			= require("path");
const helmet		= require("helmet");
const app           = express();
const port          = 2775;
const favicon		= require("serve-favicon");


 // view engine setup
app.set("views", path.join(__dirname, "Views"));
app.set("view engine", "ejs");

//This must come after the scss\sass set up
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + "/public/images/favicon.ico"));

app.use(express.json());

//Use helmet for security
app.use(helmet());

app.get('/', (req, res) => res.render("WardFinder",{ title: "Ward Finder"}));

app.listen(port, () => console.log(`Ward Finder listening on port ${port}!`));