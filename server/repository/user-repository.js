const mysql2 = require('mysql2');
const dbConfig = require('../dbconfig');
const db = mysql2.createConnection(dbConfig);
const crypt =  require('bcryptjs');

async function validateUser(params) {
  let email = params.email;
  try {
    let cryptedpassword = await crypt.hash(params.password,8);
    const count = await db.promise().query(`select count(*) AS count from users;`)
    const result = await db.promise().query(`SELECT COUNT("id") AS count from users where email = '${email}';`);

    if (result[0][0].count ) {
      return result[0][0].count;
    } 
    else if(params.password !== params.confirm_password){
      return {msg:'Password is not matching with Confirm Password'};
    }
    else {
      let result = await addUser(params,count[0][0].count+1,cryptedpassword);
      return result;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
async function addUser(params,id,code) {  
  try {
    const result = await db.promise().query(`insert into users value (${id},'${params.name}','${params.email}','${code}');`);
    return 
  } catch (error) {
    console.log(error);
  }
}

async function login(params){
  try {
    const count = await db.promise().query(`select * from users where email ='${params.email}';`)
    if (count[0][0] && await crypt.compare(params.password,count[0][0].pass_code)) { 
      return count[0][0].id
    } else {
      return false
    }
    
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = {
  addUser: addUser,
  validateUser: validateUser,
  loginUser: login,
}