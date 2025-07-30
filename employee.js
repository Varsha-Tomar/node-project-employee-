var express = require("express");
var pool = require("./pool");
var upload = require("./multer");
var router = express.Router();

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');
/* GET home page. */
router.get("/employee_interface", function (req, res, next) {
  try {
    var ADMIN=localStorage.getItem('ADMIN')
    // console.log('xxxx', ADMIN);
    if(ADMIN)
      res.render("employeeForm", { message: "", color: "black" });
    else
      res.redirect('/admin/admin_login')
  }
  catch(e) {
    res.redirect('/admin/admin_login')
  }
});


router.get("/search_employee", function (req, res, next) {

  // try {
  //   var ADMIN=localStorage.getItem('ADMIN')
  //   // console.log('xxxx', ADMIN);
  //   if(ADMIN)
  //     res.render("searchemployee", { message: "", color: "black" });
  //   else
  //     res.redirect('/admin/admin_login')
  // }
  // catch(e) {
  //   res.redirect('/admin/admin_login')
  // }

  res.render("searchemployee", { message: "", color: "black" });
});


router.get("/fetch_all_states", function (req, res) {
  pool.query("select * from states", function (error, result) {
    if (error) {
      res.json({
        status: false,
        data: [],
        message: "error in Query pls contact data Administartor.....",
      });
    } else {
      res.json({ status: true, data: result, message: "Successful" });
    }
  });
});

router.get("/fetch_all_city", function (req, res) {
  pool.query(
    "select *  from city where stateid=?",
    [req.query.stateid],
    function (error, result) {
      if (error) {
        res.json({
          status: false,
          data: [],
          message: "error in Query pls contact data Administartor....",
        });
      } else {
        res.json({ status: true, data: result, message: "Successful" });
      }
    }
  );
});

router.post("/insert_record", upload.single("picture"), function (req, res) {
  try {

    pool.query(
      "insert into employees (employeename, dob, gender, address, stateid, cityid, department, grade, salary, picture) values(?,?,?,?,?,?,?,?,?,?)",
      [
        req.body.employeename,
        req.body.dob,
        req.body.gender,
        req.body.address,
        req.body.stateid,
        req.body.cityid,
        req.body.department,
        req.body.grade,
        req.body.salary,
        req.file.filename,
      ],
      function (error, result) {
        if (error) {
          // console.log(error);
          res.render("employeeForm", {
            status: false,
            message: error,
            color: "red",
          });
        } else {
          res.render("employeeForm", {
            status: true,
            message: "Employee Submitted Successfully",
            color: "green",
          });
        }
      }
    );
  } catch (e) {
    // console.log(e)
    res.render("employeeForm", {
      status: false,
      message: "some Critical error, contact to Backend Team....",
      color: "red",
    });
  }
});


router.get("/display_all", function(req,res){

   try {
    var ADMIN=localStorage.getItem('ADMIN')
    if(ADMIN==null)
      res.redirect('/admin/admin_login')
      // res.render("employeeForm", { message: "", color: "black" });
  }
  catch(e) {
    res.redirect('/admin/admin_login')
  }

  try{
  pool.query("select E.*,(select S.statename from states S where S.stateid=E.stateid ) as statename,(select C.cityname from city C where C.cityid=E.cityid ) as cityname from employees E", function(error,result) {
    if(error) {
      res.render("displayall",{status: false, message:'Error in database query....'})
    }
    else {
      console.log(result)
       res.render("displayall",{status: true, data: result })
    }

  })
  }

  catch(e) {
    res.render("displayall",{status: false, message:'Critical error in server....'})
  }
});

router.get("/edit_delete_display", function (req, res, next) {
   try{
  pool.query("select E.*,(select S.statename from states S where S.stateid=E.stateid ) as statename,(select C.cityname from city C where C.cityid=E.cityid ) as cityname from employees E where E.employeeid=?",[req.query.employeeid], function(error,result) {
    if(error) {
      res.render("editdeletedisplay",{status: false, message:'Error in database query....'})
    }
    else {
      if(result.length==1) 
       res.render("editdeletedisplay",{status: true, data: result[0] })
      else
        res.render('searchemployee', {message: 'Employee not Exist', color: "red"})
    }

  })
  }

  catch(e) {
    res.render("editdeletedisplay",{status: false, message:'Critical error in server....'})
  }
  
});

router.post("/final_edit_delete",function (req, res) {
  try {
    if(req.body.btn == 'Edit') {
    pool.query(
      "update employees set employeename=?, dob=?, gender=?, address=?, stateid=?, cityid=?, department=?, grade=?, salary=? where employeeid=?",
      [
        req.body.employeename,
        req.body.dob,
        req.body.gender,
        req.body.address,
        req.body.stateid,
        req.body.cityid,
        req.body.department,
        req.body.grade,
        req.body.salary,
        req.body.employeeid,
      ],
      function (error, result) {
        if (error) {
          // console.log(error);

          res.redirect("/employee/display_all")
          // res.json({success: false})

        } else {
           res.redirect("/employee/display_all")
          // res.json({success: true})
        }
      });
  }  
  else{

    pool.query(
      "delete from employees where employeeid=?",
      [
      
        req.body.employeeid,
      ],
      function (error, result) {
        if (error) {
          // console.log(error);

          res.redirect("/employee/display_all")

        } else {
           res.redirect("/employee/display_all")
        }
      });

  }
  }
  catch (e) {
    // console.log(e)

     res.redirect("/employee/display_all")
  }
});


router.get("/show_picture",function(req, res){  
  // console.log(req.query);
  
  res.render("showpicture", {data: req.query})
  // console.log("Employee Name",req.query.employeename)
});



router.post("/edit_picture",upload.single('picture'),function(req,res){
try{  
pool.query("update employees set picture=? where employeeid=?",[ req.file.filename,req.body.employeeid],function(error,result){
  if(error){
res.redirect("/employee/display_all")

  }
  else
  {
    res.redirect("/employee/display_all")
  }
})
}
catch(e)
{
    res.redirect("/employee/display_all")
}

});

module.exports = router;
