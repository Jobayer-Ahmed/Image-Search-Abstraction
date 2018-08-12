// Dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const searchModel = require('./models/models');
const GoogleImages = require('google-images');
const client = new GoogleImages('002916167679446344357:nelykjs5vxm', 'AIzaSyBM_FEratCuy8hFXj5cxihvPGt0qSh1VPs');

// App Useses
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*"); // "*" for public access and www.example.com for specific uses
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}
	next();
});

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchModel');

// App get
app.get('/api/recent', (req, res, next) => {
	searchModel.find({}, (err, data) => {
		res.json(data);
	});
})

app.get('/api/imagesearch/:searchValue*', (req, res, next) => {
	let {searchValue} = req.params;
	let data = new searchModel({
		searchValue,
		searchDate: new Date()
	})

	data.save(err => {
		if (err) {
			res.send("Error Saving to Database");
		}
		// res.json(data)
	})
	let imageData = [];
	client.search(searchValue, {page: 1})
		.then(images => {
			for(let i = 0; i < 10; i++) {
				imageData.push({
					url: images[i].url,
					name: images[i].description,
					thumbnail: images[i].thumbnail.url,
					context: images[i].parentPage
				})
			}
			res.json(imageData);
		});
});

// Listening App
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
})




// 002916167679446344357:nelykjs5vxm
// db63791f74064c3ca3a65570902162f5