const mysql=require('mysql2')
const connection = mysql.createConnection({
    host:'localhost',
    user:'admin',
    password:'123456',
    database:'blog'
})
module.exports=connection.promise();

// connection.connect((err)=>{
//     if(err) throw err;
//     connect.query('SELECT usid FROM USERS WHERE usid="1"',(err,result)=>{
//         if(err) throw err;
//         console.log(result[0].usid);
//     })
// })


