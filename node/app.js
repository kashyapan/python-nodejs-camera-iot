const express = require('express')
const fs = require('fs')
const formidable = require('formidable')
const path = require('path')
const    _ = require('underscore')
var fileName = 'statusFile.txt'
const img_dir = './images/'

const app = express()

var public = __dirname + "/images/";

app.use('/images' ,express.static(public))

app.use('/public' ,express.static('public'))

// If this route is requested then do the following
// User wants to switch on Camera
// Change file to True
// if everything goes well then response as success

app.get('/on', function (req, res) {

	//Make file {status : true}
	changeStatus(fs , '{"status":true}' , function(){
		//Send link to image {"success":true , "image_path" : "http://"}
		
		res.json({"success":true })	
	})

})

app.get('/getImage' , function(req , res) {

		var img_link = '/images/' 
		img_link += getMostRecentFileName(public)
		res.json({"image_path" : img_link})

})
app.get('/off' , function(req , res){
	
	//Make file {status : false}
	changeStatus(fs , '{"status":false}' , function(){
		res.json({"success":false})	
	})
})

app.get('/snap' , function(req , res){
	
})

app.get('/status' , function(req , res){
	//read file and send  JSON
	fs.readFile(fileName , 'utf8', function(err , data){
		
		json_data =  JSON.parse(data)
		

		changeStatus(fs , '{"status":false}' , function(){
			console.log("Camera Turn off flag")
		})		

		res.json(data)
		
	})	
	
})


app.get('/*'  ,function(req, res){

	res.send('No such routes') ;
})

app.post('/upload',function(req, res){

	var form =  new formidable.IncomingForm();
	
	form.parse(req , function(err , fields , files) {
	
      var oldpath = files.filetoupload.path;
      var newpath = img_dir+files.filetoupload.name;
 
      fs.rename(oldpath, newpath, function (err) {
      
        if (err) throw err;
		
		res.send('File uploaded and moved to ' + newpath) ;
    
      })
      
	} ) 
	
} )
//

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


/*Utility Functions */

// File System


function changeStatus(fs , status ,  cb)
{
	fs.writeFile('statusFile.txt' , status , function(err){

		if(err) throw err
		
		console.log('Saved')
		cb()
	})
} 


function getMostRecentFileName(dir) {
    var files = fs.readdirSync(dir);

    // use underscore for max()
    return _.max(files, function (f) {
        var fullpath = path.join(dir, f);

        // ctime = creation time is used
        // replace with mtime for modification time
        return fs.statSync(fullpath).ctime;
    });
}

