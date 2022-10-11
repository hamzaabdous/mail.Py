var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var fs = require("fs");

var app = express();
var port = 8082;

// create file html with request content
function createFile(content) {
  try {
    filename = "emailBody";
    fs.writeFile(filename, content, function(err) {
      if (err) throw err;
      console.log("File is created successfully.");
    });
  } catch (error) {
    console.error(error);
  }
}

function sendMail(damage, email, department,status) {
  // html header and style sheet
  var htmlUp =
  "<html lang='en'> <head> <style>.DamageDetails {border-collapse: collapse;width: 100%;padding: 35px;} .DamageDetails h5 {color: #0004a;font-style: italic;font-family: system-ui;font-weight: 400;font-size: 17px;}  .DamageDetails tr .valueColumn {background-color: #fff !important;width: 70%;}  .DamageDetails tr td {border: 1px solid #aeaeae;background-color: #284066;padding: 15px;width: 30%;}  .DamageDetails tr td h3 {color: #fff;font-size: 22px;font-weight: bold;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}  .DamageDetails tr td h4 {color: #6c6c6c;font-size: 20px;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;} span{color: #004ccc;font-size: 15px;font-weight: bold;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;}</style> </head> <body> <p>We bring to your attention  that the equipment(shown below) has been  <span >"+ status +" </span> </p><p> You'll find  the details in the CheckList report for subject date: </p> <table class='DamageDetails'> <tbody>";
  var htmlDown = "</tbody></table> <p>Kind regards.</p></body></html>";
    var content = "";
  // boucle in object from request body to html content
  for (const [key, value] of Object.entries(damage)) {
    content +=
      "<tr><td><h3>" +
      key +
      "</h3></td> <td class='valueColumn'><h4>" +
      value +
      "</h4></td></tr>";
  }
  content = htmlUp + content + htmlDown;
  createFile(content);
  const { exec } = require("child_process");
  return new Promise((resolve, reject) => {
      // exect script python from file ./sendemail.py
    exec(
      "python ./sendMail.py " + email + " " + department,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          reject(error.message);
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
          reject(stderr);
        }
        if (stdout) {
          console.error(`stdout: ${stdout}`);
        }
        resolve(true);
      }
    );
  });
}
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// endpoint localhost:8082/api
app.post("/api", function(req, res) {
  var out = null;
  sendMail(req.body.payload, req.body.email, req.body.department,req.body.status)
    .then((out) => {
      res.send(true);
    })
    .catch((out) => {
      res.send(false);
    });
});

var server = app.listen(port);
