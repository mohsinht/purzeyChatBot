'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//processing the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//routes

app.get('/', function(req, res){
	res.send("Hello World! -Mohsin")
})


//facebook connect
app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token'] === 'mohsinhayat'){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.listen(app.get('port'), function(){
	console.log("RUNNING: port")
})
