const express = require  ('express');
const app = express();
const fs   = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dbConfig = require("./dbconfig");
const path = require('path');
const env  = require('dotenv').config();
const port = process.env.port||8090;
const staticPath = path.join(__dirname,'/public');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const db  = mysql.createConnection(dbConfig);
app.set("view engine","hbs");
const partialPath = path.join(__dirname,"/views/partials");
hbs.registerPartials(partialPath);

db.connect(async (err)=>{
    if (err) throw err
       console.log("Connected");    
});
app.use(cookieParser())
app.use('/auth', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(staticPath));

app.use('/',require('./routers/routes'));
app.use('/auth',require('./routers/auth'));

app.listen(port,()=>{
    console.log("server started:8090");
});
