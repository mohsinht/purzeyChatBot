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

let token = "EAANqtvRqU5oBAGHtnynk1THZC1kXv0OYJjsZAwtSWHcBCSqhx2sGcZCNzhFP1vBUmaW8T5mTwnHaNWwZA25riQKZBBVaiCWwcV0qWpv9UyrHne9w7mMfx3zqhYC2GEVaZA3onUDyyAeUgv2ehnlBKDddEGHuccoXEtZAWybo37z0wZDZD"
//facebook connect
app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token'] === "mohsinhayat"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for(let i = 0; i<messaging_events.length; i++){
		let event = messaging_events[i]
		let sender = event.sender.id
		if(event.message && event.message.text){
			let text = event.message.text.toLowerCase()
			if(text.includes("happy")){
				sendText(sender, "I'm happy too :)")
			}if(text.includes("aoa") || text.includes("salam") || text.includes("aslam") || text.includes("aslamualaikum")){
				sendText(sender, "Walaikum-Asalam!")
			}
			if(text.includes("itu") || text.includes("information technology") || text.includes("arfa") || text.includes("plan9")){
				sendText(sender, "Mubeen Ikram is our campus ambassador at ITU, Lahore. He'll handover your order to you.")
			}else{
			sendText(sender, "You wrote: " + text.substring(0, 100))
		}
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text){
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs: {access_token : token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message: messageData
		}
	}, function(error, response, body){
		if(error){
			console.log("sending error")
		}else if(response.body.error){
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function(){
	console.log("RUNNING: port")
})
