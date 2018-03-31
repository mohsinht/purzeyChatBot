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
		saveToDatabase(sender, text)
		if(event.message && event.message.text){
			let text = event.message.text.toLowerCase()
			let guess = event.message.nlp
			const greeting = firstEntity(guess, 'greetings');
			if (greeting && greeting.confidence > 0.8) {
				var k = Math.random()
				if(k>0.8){
					sendText(sender, "Hello! How you doing?")
				}else if(k>0.6){
					sendText(sender, "Hey! Welcome to Purzey!")
				}else if(k>0.4){
					sendText(sender, "AoA! Kya haal hai?")
				}else if(k>0.2){
					sendText(sender, "Hi! Did you see our shop?")
				}else{
					sendText(sender, "Hey! :) " )
				}
    			
 			}

 			const uni = firstEntity(guess, 'university');
 			if (uni && uni.confidence > 0.8){
 				sendText(sender, "You talked about your university " + uni.value)
 			}


 			const prd = firstEntity(guess, 'product');
 			 if (prd && prd.confidence > 0.8){
 			 	const prd_t = firstEntity(guess, 'product_type');
 			 	if(prd_t && prd_t.confidence > 0.8)
 				{
 					if(prd.value == 'Handsfree' && prd_t.value == 'Samsung'){
 						sendText(sender, "The price of Samsung Handsfree is 70PKR only. Kindly send us complete order to generate a receipt.")
 					}
 					sendText(sender, "You talked about our product: " + prd_t.value + " " + prd.value)
 				}else{
 					if(prd.value == 'Handsfree'){
 						sendText(sender, "You haven't mentioned which handsfree do you want. We have 3 kinds of handsfrees")
 					}
 					sendText(sender, "You talked about our product: " + prd.value)
 				}
 			}

 			const byed = firstEntity(guess, 'bye');
			if (byed && byed.confidence > 0.8) {
    			sendText(sender, "Thank you so much. Bye!")
 			} 

 			const phNum = firstEntity(guess, 'phone_number');
			if (phNum && phNum.confidence > 0.8) {
				let phn = text.substring(phNum.start, phNum.end)
    			sendText(sender, "We have noted down your Phone number. Kindly wait while the campus ambassador contacts you.")
 			} 

 			const timing = firstEntity(guess, 'datetime');
			if (timing && timing.confidence > 0.8 && (text.includes("free") || text.includes("slot"))) {
				let time = text.substring(timing.start, timing.end)
    			sendText(sender, "We have noted down your time-slot. Please wait while the campus ambassador confirms this time-slot.")
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
			else if(text.includes("fast university") || text.includes("fast lahore") || 
				text.includes("fast-nu") || text.includes("nuces") || text.includes("fastnu")
				|| (text.includes("fast") && (text.includes("university") || text.includes("uni")) )){
				sendText(sender, "Mohsin Hayat is our campus ambassador at FAST-NU, Lahore. He'll handover your order to you.")
			}

			const qt = firstEntity(guess, 'quantity');
			if (qt && qt.confidence > 0.8) {
    			sendText(sender, "Noted. You want " + qt.value + " " + qt.product)
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


function saveToDatabase(sender, text){
	var dbRef = new Firebase('https://purzey-b9cbd.firebaseio.com/customers/');
	var spamRef = dbRef.child('C - ' + sender);
	spamRef.push({
		msg: text
	});

}