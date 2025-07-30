var express = require('express');
var pool=require('./pool')

var router = express.Router();
var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

/* GET home page. */


router.get('/admin_login', function(req, res, next) {
  // res.render('adminlogin',{message:''});
  res.render('login',{message:''});
  
});

router.post('/chk_admin_login',function(req,res){
try{  
pool.query("select * from admins where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.mobileno,req.body.password],function(error,result){
if(error)
{  
  //  console.log(error)
  //  res.render("adminlogin",{status:false,message:'Database Error'})
   res.render("login",{status:false,message:'Database Error'})
}
else
{
  if(result.length==1)  
  { localStorage.setItem('ADMIN',JSON.stringify(result[0]))
   res.render("dashboard",{status:true,data:result[0]})
  }
  else
    // res.render("adminlogin",{status:false,message:'Invalid EmailId/Mobile Number'})
    res.render("login",{status:false,message:'Invalid EmailId/Mobile Number'})
  
}

})
}
catch(e)
{
   res.render("displayall",{status:false,message:'Critical Server Error....'})
}

})


router.get('/logout', function( req, res) {
  localStorage.clear()
  res.redirect('/admin/admin_login')
})

module.exports=router

