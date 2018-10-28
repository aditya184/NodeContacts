var express = require('express');
var bodyParser = require('body-parser');
const db = require('monk')('localhost:27017/nodecontacts');
var app = express();

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended: false}))
app.use("/public",express.static(__dirname + "/assets"))

app.get("/",function(req,res) {
	db.get("contacts").find().then(function(results){
		//console.log(results)
		res.render("showcontacts",{records:results})
	})
})

app.get("/add",function(req,res){
	res.render("addcontact")
})

app.post("/actionpage",function(req,res){
	//console.log(req.body)
	db.get("contacts").insert(req.body).then(function(results){
		res.redirect("/")
	})
})

app.get("/edit/:userid",function(req,res){
	// console.log(req.params)
	var id = req.params.userid;
	db.get("contacts").find({_id:id}).then(function(results){
		// console.log(results)
		res.render("editcontact",{record:results[0]})
	})
})

app.post("/update",function(req,res){
	// console.log(req.body)
	db.get("contacts").update({_id:req.body.userid},{$set:{f_name:req.body.f_name,l_name:req.body.l_name,mobile:req.body.mobile}}).then(function(results){
		res.redirect("/")
	})
})

app.get("/delete/:userid",function(req,res){
	// console.log(req.params)
	var id = req.params.userid;
	db.get("contacts").remove({_id:id}).then(function(results){
		res.redirect("/")
	})
})

app.post("/search",function(req,res){
	// console.log(req.body)
	db.get("contacts").find({$or:[{f_name:req.body.search},{l_name:req.body.search},{mobile:req.body.search}]}).then(function(results){
		// console.log(results)
		res.render("showcontacts",{records:results})
	})	
})

app.listen(5000)
