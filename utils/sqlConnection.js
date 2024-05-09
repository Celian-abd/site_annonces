const mysql = require("mysql");
  
let db_con = mysql.createConnection({
    host: "db",
    user: "user",
    password: "password",
    database: "test_db"
});
  
db_con.connect((err) => {
    if (err) {
      console.log("La connexion a échoué !!!", err);
    } else {
      console.log("Connexion reussis");
    }
});

module.exports = db_con;
