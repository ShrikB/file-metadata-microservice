var express = require('express');
var cors = require('cors');
require('dotenv').config()

var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const mongoose = require('mongoose');
const { Schema } = mongoose;


const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const fileSchema = new Schema({
  name: [String],
  type: [String],
  size: [Number]
});

const FileDB = mongoose.model("FileUploadData", fileSchema);

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//database storing file if needed
function newFileData(fileData) {
  var newFile = new FileDB();
    newFile.name = fileData;
    newFile.type = "";
    newFile.size = 0;
    newFile.save().then((data => {
      console.log(data);
    })).catch((err) => {
      console.log(err);
    })
}

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  var fileName = req.file.originalname;
  var filebody = req.file.mimetype;
  var fileSize = req.file.size;
  //console.log(fileName);
  //console.log(filebody);
  res.send({"name":fileName, "type":filebody,"size":fileSize})
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
