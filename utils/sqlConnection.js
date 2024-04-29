const mysql = require("mysql");
  
let db_con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: '',
    database: 'annonce_bdd'
});
  
db_con.connect((err) => {
    if (err) {
      console.log("La connexion a échoué !!!", err);
    } else {
      console.log("Connexion reussis");
    }
});

module.exports = db_con;
