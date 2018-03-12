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

let token = "EAACzZALUsmqYBAIeJ1IHeFXticRO0Ac7LEXbuaUe6pxwUoMZBi3EvHK4kMC4TjXAgbvZAZAudmi5qabXtGKCfJ13NZCeNk9petjkG7x48vWJZBvVgbdsEOwnAzaASwRmZCpSAtmbLHRE7jSxsYV0ZCfmSFwDUgI3zSQNZB3ZASTR1zwgZDZD"
//facebook connect
app.get('/webhook/', function(req, res){
	if(req.query['hub.verify_token'] === "mohsinhayat"){
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong Token")
})

function firstEntity(nlp, name) {
  return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for(let i = 0; i<messaging_events.length; i++){
		let event = messaging_events[i]
		let sender = event.sender.id

		if(event.message && event.message.text){
			let text = event.message.text.toLowerCase()
			let guess = event.message.nlp
			const greeting = firstEntity(guess, 'greetings');
			if (greeting && greeting.confidence > 0.8) {
    			sendText(sender, "Hey!")
 			} 
 			const byed = firstEntity(guess, 'bye');
			if (byed && byed.confidence > 0.8) {
    			sendText(sender, "Thank you so much. Bye!")
 			} 

 			const phNum = firstEntity(guess, 'phone_number');
			if (phNum && phNum.confidence > 0.8) {
				let phn = text.substring(phNum.start, phNum.end)
    			sendText(sender, "We have noted down your Phone number. \n Your Phone Number = " + phn)
 			} 

 			const timing = firstEntity(guess, 'datetime');
			if (timing && timing.confidence > 0.8 && (text.includes("free") || text.includes("slot"))) {
				let time = text.substring(timing.start, timing.end)
    			sendText(sender, "Is your timeslot " + time + "? Please wait while the campus ambassador confirms this timeslot.")
 			} 


			if(text.includes("aoa") || text.includes("salam") || text.includes("aslam") || text.includes("aslamualaikum")){
				sendText(sender, "Walaikum-Asalam!")
			}
			if(text.includes('?')){
				sendText(sender, "Your question has been noted down. We'll reply you in a while.")
			}
			else if(text.includes("itu") || text.includes("information technology") || text.includes("arfa") || text.includes("plan9")){
				sendText(sender, "Mubeen Ikram is our campus ambassador at ITU, Lahore. He'll handover your order to you.")
			}
			else if(text.includes("comsats")){
				sendText(sender, "Khunshan Butt is our campus ambassador at COMSATS, Lahore. He'll handover your order to you.")
			}
			else if(text.includes("fast university") || text.includes("fast lahore") || text.includes("fast-nu") || text.includes("nuces") || text.includes("fastnu")){
				sendText(sender, "Mohsin Hayat is our campus ambassador at FAST-NU, Lahore. He'll handover your order to you.")
			}

			else{
			//sendText(sender, "You wrote: " + text.substring(0, 100))
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
