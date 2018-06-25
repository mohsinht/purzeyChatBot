'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')


const app = express()

//------FIREBASE SETUP ----
/** Firebase **/
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'purzey-b9cbd',
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCzTQSoYiSPIkE8\nkvmxYmmrDEeIUculOmaF999D6NQMx+13UlCKwnwkHAemoZzthY+80nFMCd4ez4TE\n4nGlmxP2HhGhJy7tnt4D6FoUxpIvkxd6JFdjMCQxvHPDh03ZD+YByr4n2a78Bvwy\nncnL+1yIPzefXXmn7S94E7eWWYa9Z1hiLzFDlOMiffyuEyOofaaDVIkK1hCnQRFl\nF9+Svk3DeKWJJ1mVKg0xr7sbmvykXTDXHGvqePK4OELpn/P+roH4TW43kya/jA2X\nYc+QavzxmkyZNS/DwdDBefEcSDrpGf6WvyWuPKDAzH2dNgncWD8iN8YFtubShxd7\ntuJ4zJv7AgMBAAECggEAQcb29vjuNY5ZBWpb7M3QOx5pnaJ4RZjLpMke4JBpPnkX\n7kbF4mnf1fVsfx5Z7i8p4JkJVF5oXMA/kmUKUTk3lPpJ+GdiCW1XQHK8nVONrKNX\nIQl0/5/ZH1/lziz0i7WP6UdiBEeRMMc1PTJypgEEXL1oX/AQYeEbIX+GQcN9MT07\nJ96x44NCkAx1vWqaO9Gt45WI45uBvHhvZBwlKJtMmh/rLP7XwdIsj66qImcW6OgO\nzm5VsbusqkJtArZ0DnISX+Jyi29+Aif4bmMuP6N85RvieiCon8xeeFRZ91mweT1E\n77jNVJk/luf0XsW5S9Ez1xy3xewSzAEQZQ8htkAJPQKBgQDrLGviwVnVRqtBrrZO\nPkFx5gtp3oOtWbprsjqwUnEdqMZHzVN/vDOmQuqDGvhyCXsDtkXxHTegliJaq47h\n684fgUBXMQmjpR10ahTpuC/DnqojzxK40h56ur6l5Mv/+pggvvMwbXcYe1l7dtUv\nZDkY2mA20fpj+zwm2g+FcKFxDwKBgQDDLerFIOGo3cFoofePi309edRIm4oRJQJc\nPolJoOIIDEucj+DlrOyET8Dp5mrp94O05gy7+e9NRI6QuKZl4N99/BpN/EcQp1cO\nG379L8O1C5F07/GNHPQR+VlmZ13oOGEUgOsuopebNkwEvCOIK/7DNcWmpwQ7f/Se\nhl5TwkjOVQKBgQC+w2zMJj0hhM6cXAVjmJprsshlW2sCrftLKuryZh19io80ZTir\nL9XRswwZx0Hq9wfDLhK0EBg0ejRpyin/1tB/u8+eKpgAF4q6CObn41FTZBvtKias\npzy0H1FQrjRQc0z9mwcXrGPkBwLB5NXvOGQcZd+P+GocugnEFjRq8L70PwKBgQCm\nIKEhZNluCEIlMycp8QqKlvXPT0R3T07xAPGNz/hT7VM2UWiVVViDTfbfn5YEyv45\nrU3NefDrjZzjJafMM1lHPJuPIVnDnQuGIHU4P72Ojegi5lBtUeWUnu4vMXBGxiYr\nc4e6S/5KyC5wIUsFDp1rvosbTDFYC5NEkw4asNWTeQKBgQDLCb5o3VVGgkOj6uBg\nivt/FrjEG1/HhBRAQxY/EGQWC3ySf4uwuqDslC6sfzq6PUrU+y67YMpc3ZfW4a6z\nWULOiQVUo6EWx3nWW2pWYqxa40UwmG0sPyxwDrVWwXZ3OCoKs2o0PC2yMhvxV8IH\ne/njRaffaQdWx/G057CWnxXpdQ==\n-----END PRIVATE KEY-----\n",
  	clientEmail: "firebase-adminsdk-f5le9@purzey-b9cbd.iam.gserviceaccount.com",
  }),
  databaseURL: 'https://purzey-b9cbd.firebaseio.com'
});

//----------


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
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		let dbPh = ''
		let goUNI = getDataFromDB(sender, 'University', dbPh)
		let goDB = getDataFromDB(sender, 'Phone', dbPh)
		let goCAM = getDataFromDB(sender, 'Campus', dbPh)
		let userName = getDataFromDB(sender, 'Name', dbPh)
		let prdINFO = getProduct("akghf")
		if(userName == null){
			var request = require('request');
			var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + sender + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + token;
			request({
			    url: usersPublicProfile,
			    json: true // parse
			}, function (error, response, body) {
			        if (!error && response.statusCode === 200) {
			        	saveinDB(sender, 'Name', body.first_name + ' ' + body.last_name);
			            saveinDB(sender, 'dp', body.profile_pic);
			            saveinDB(sender, 'Gender', body.gender);
			        }
			    });
		}
		if (event.postback) {
  	    	let text = JSON.stringify(event.postback)
  	    	sendText(sender, "Postback received: "+text.substring(0, 200), token)
  	    	continue
      	}
		if(event.message && event.message.text){
			let text = event.message.text.toLowerCase()
			let guess = event.message.nlp
			const greeting = firstEntity(guess, 'greetings');
			const intent = firstEntity(guess, 'intent');
			saveDataInDatabase(sender, text)
			if (text === 'generic') {
			    sendGenericMessage(sender)
		    	continue
		    }
			if(text.includes("profile")){
				let profMsg = '';
				if(userName!=null){
					profMsg += "\n*Name:* " + userName.value
				}
				if(goUNI!=null){
					profMsg += "\n*University:* " + goUNI.value
				}
				if(goDB!=null){
					profMsg += "\n*Phone #:* " + goDB.value
				}
				profMsg = profMsg + "\n*Order Count:* 0"
				sendText(sender, "We have your profile saved with us: " + profMsg)
			}

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

 			if(intent && intent.confidence > 0.8){
 				if(intent.value == "asking_website"){
 					sendText(sender, "We don't have a website right now. But we do manage our business on Facebook very well, you can see the shop and contact us at any time you want." )	
 				}
 				if(intent.value == "asking_email"){
 					sendText(sender, "You can email us at our email address: purzey2018@gmail.com")
 				}
 				if(intent.value == 'slang'){
 					sendText(sender, ":D :P")
 				}
 				if(intent.value == 'product_inquiry'){
 					sendText(sender, "Your question about the product has been noted. We'll let you know after confirmation")
 				}
 				if(intent.value == 'abuse'){
 					sendText(sender, "Abusing will cause a permanent ban.")
 				}
 				if(intent.value == 'order_received'){
 					sendText(sender, "Have a good day :) Kindly rate our services and share Purzey with your friends.")
 				}
 				if(intent.value == 'asking_phone'){
 					sendText(sender, "Kindly contact Khunshan: 0321 4441444")
 				}
 			}
 			const uni = firstEntity(guess, 'university');
 			if (uni && uni.confidence > 0.8){
 				//sendText(sender, "You talked about your university " + uni.value)
 			}


 			const prd = firstEntity(guess, 'product');
 			 if (prd && prd.confidence > 0.8){
 			 	const prd_t = firstEntity(guess, 'product_type');
 			 	let prID = 'noID'
 			 	if(prd_t && prd_t.confidence > 0.8)
 				{
 					if(prd.value == 'Handsfree' && prd_t.value == 'Samsung'){
 						prID = 'j5hf'
 					}
 					 if(prd.value == 'Handsfree' && prd_t.value == 'c7'){
 						prID = 'c7hf'
 					}
 					if(prd.value == 'Handsfree' && prd_t.value == 'AKG'){
 						prID = 'akghf'
 					}
 					//sendText(sender, "You talked about our product: " + prd_t.value + " " + prd.value)
 				}else{
 					if(prd.value == 'Handsfree'){
 						sendText(sender, "You haven't mentioned which handsfree do you want. We have 3 kinds of handsfrees.")
 					}
 					//sendText(sender, "You talked about our product: " + prd.value)
 				}
 				if(prd.value == 'Mouse Pad'){
 					prID = 'lgmp'
 				}


 				if(prID != 'noID'){
 					getProduct(prID)
				    .then((prdINFO) => {
				        sendText(sender, "The price of " + prdINFO.name + " is " + prdINFO.price + "PKR only.")
				    })
 					
 				}
 				
 			}

 			const byed = firstEntity(guess, 'bye');
			if (byed && byed.confidence > 0.8) {
    			sendText(sender, "Thank you so much. Bye!")
 			} 

 			const phNum = firstEntity(guess, 'phone_number');
			if (phNum && phNum.confidence > 0.8 && phNum.value.length > 10 && phNum.value.length < 15) {
				//let phn = text.substring(phNum.start, phNum.end)

				if(!goDB){
					saveinDB(sender, 'Phone', phNum.value)
    				sendText(sender, "We have noted down your Phone number: " + phNum.value + ". Kindly wait while the campus ambassador contacts you.")
 				}
 				else{
 					sendText(sender, "We have already saved your Phone Number: " + goDB.value)
 				}
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
				//sendText(sender, "Your question has been noted down. We'll reply you in a while.")
			}
			
			
			if(text.includes("itu") || text.includes("information technology") || text.includes("arfa") || text.includes("plan9")){
				if(goUNI == null){
					saveinDB(sender, 'University', 'ITU')
					sendText(sender, "Mubeen Ikram is our campus ambassador at ITU, Lahore. He'll handover your order to you.")
				}
				else{
					sendText(sender, "We have already saved that you are from " + goUNI.value + ".")
				}		
			}
			else if(text.includes("comsats")){
				if(goUNI == null){
					saveinDB(sender, 'University', 'COMSATS')
					sendText(sender, "Khunshan Butt is our campus ambassador at COMSATS, Lahore. He'll handover your order to you.")
				}else{
					sendText(sender, "We have already saved that you are from " + goUNI.value + ".")
				}		
			}
			else if(text.includes("fast university") || text.includes("fast lahore") || 
				text.includes("fast-nu") || text.includes("nuces") || text.includes("fastnu")
				|| (text.includes("fast") && (text.includes("university") || text.includes("uni")) )){
				if(goUNI == null){
					saveinDB(sender, 'University', 'Fast-NU')
					sendText(sender, "Mohsin Hayat is our campus ambassador at FAST-NU, Lahore. He'll handover your order to you.")
				}else{
					sendText(sender, "We have already saved that you are from " + goUNI.value + ".")
				}		
			}else if(text.includes("pucit") || text.includes("punjab university")){
				if(goUNI == null){
					saveinDB(sender, 'University', 'PUCIT')
					if(text.includes("new")){
						saveinDB(sender, 'Campus', 'New')
						sendText(sender, "Mustaghees Butt is our campus ambassador at PUCIT, New Campus, Lahore. He'll handover your order to you.")
					}else if(text.includes("old")){
						saveinDB(sender, 'Campus', 'Old')
						sendText(sender, "We are not yet available in PUCIT old campus.")
					}else{
						sendText(sender, "You haven't mentioned which campus are you from?")
					}
				}else{
					sendText(sender, "We have already saved that you are from " + goUNI.value + ".")
				}		
			}
			else if(text.includes("new campus")){
				if(goCAM == null){
					saveinDB(sender, 'Campus', 'New')
					sendText(sender, "Mustaghees Butt is our campus ambassador at PUCIT, New Campus, Lahore. He'll handover your order to you.")
				}
			}
			else if(text.includes("old campus")){
				if(goCAM == null){
					saveinDB(sender, 'Campus', 'Old')		
				}
				sendText(sender, "We're sorry but we are not available in old campus")
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



function saveDataInDatabase(sender, text){
	var db = admin.database();
	var ref = db.ref("server/messenger");

	var senderRef = ref.child("customer " + sender + "/chat");

	var chatRef = senderRef.push();
	chatRef.set({
	  msg: text
	});
}

function saveinDB(sender, child, data){
	var db = admin.database();
	var ref = db.ref("server/messenger");
	var custRef = ref.child("customer " + sender + "/" + child);
	custRef.set({
	  value: data
	});
}

function getDataFromDB(sender, child, data){
	// Get a database reference to our posts
	var db = admin.database();
	var ref = db.ref("server/messenger/customer " + sender + "/" + child);
	let rData = '';
	// Attach an asynchronous callback to read the data at our posts reference
	ref.on("value", function(snapshot) {
	  rData = snapshot.val();
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
	return rData;
}





function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_element_style": "compact",
        "elements": [
          {
            "title": "Classic T-Shirt Collection",
            "subtitle": "See all our colors",
            "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",          
            "buttons": [
              {
                "title": "View",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/collection",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
              }
            ]
          },
          {
            "title": "Classic White T-Shirt",
            "subtitle": "See all our colors",
            "default_action": {
              "type": "web_url",
              "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
              "messenger_extensions": false,
              "webview_height_ratio": "tall"
            }
          },
          {
            "title": "Classic Blue T-Shirt",
            "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
            "subtitle": "100% Cotton, 200% Comfortable",
            "default_action": {
              "type": "web_url",
              "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
              "messenger_extensions": true,
              "webview_height_ratio": "tall",
              "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
            },
            "buttons": [
              {
                "title": "Shop Now",
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
              }
            ]        
          }
        ],
         "buttons": [
          {
            "title": "View More",
            "type": "postback",
            "payload": "payload"            
          }
        ]  
      }
    }
	}
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    message: messageData,
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}





function pushOrder(sender, prdID){
	var db = admin.database();
	var ref = db.ref("server/messenger");
	var custRef = ref.child("customer/" + sender + "/order");
	custRef.set({
	  product: prdID
	});
}

function getProduct(prID){
     var db = admin.database()
     var collectionRef = db.ref('server/products')
     var ref = collectionRef.child(prID)
     return ref.once('value')
         .then((snapshot) => {
             return snapshot.val()
         })
}