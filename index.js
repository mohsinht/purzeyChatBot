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
		if (event.postback) {
  	    	let text = JSON.stringify(event.postback)
  	    	sendMarkSeen(sender)
      		sendTypingOn(sender)
      		sendTypingOff(sender)
  	    	//sendText(sender, "Postback received: "+text.substring(0, 200), token)
  	    	if(event.postback.payload === 'CONTACT_INFO_PAYLOAD'){
  	    		sendContactInfo(sender)
  	    	}
  	    	if(event.postback.payload === 'PROFILE_PAYLOAD'){
  	    		getUserProfile(event.sender.id)
				.then((cuser) => {
					let profMsg = '';
					if(cuser.Name.value!=null){
						profMsg += "\n*Name:* " + cuser.Name.value
					}
					if(cuser.University.value!=null){
						profMsg += "\n*University:* " + cuser.University.value
					}
					if(cuser.Phone.value!=null){
						profMsg += "\n*Phone #:* " + cuser.Phone.value
					}
					profMsg = profMsg + "\n*Order Count:* 0"
					sendText(sender, "We have your profile saved with us: " + profMsg)	
				})
  	    	}
  	    	if(event.postback.payload === 'HISTORY_PAYLOAD'){
  	    		sendText(sender, "Ye feature abhi testing k marahil main hai.")
  	    	}
  	    	if(event.postback.title === 'Get Started'){
  	    		//sendText(sender, "Purzey ko choose krnay ka shukria.")
  	    		askShuruKrain(sender)
  	    	}
  	    	continue
      	}
    	if(event.message.attachments){
    		//sendText(sender, "Adding: " + event.message.attachments[0].title)
    		if(event.message.attachments[0].title){
	    		getProduct(event.message.attachments[0].title)
				.then((prd) => {
					if(prd !== null){
						productOffer(sender, prd)
					}
				})
			}
		} 
      	if(event.message && event.message.text){
      		sendMarkSeen(sender)
      		sendTypingOn(sender)
      		setTimeout(function() { sendTypingOff(sender) }, 1000)
      		let text = event.message.text.toLowerCase()
			let guess = event.message.nlp
			const intent = firstEntity(guess, 'intent')
 			getUserProfile(event.sender.id)
			.then((cuser) => {
				if(cuser === null){
					askShuruKrain(sender)
					var request = require('request');
					var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + sender +
					'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token='
					+ token;
					request({
					    url: usersPublicProfile,
					    json: true // parse
					}, function (error, response, body) {
					        if (!error && response.statusCode === 200) {
					        saveinDB(sender, 'Name', body.first_name + ' ' + body.last_name);
					            saveinDB(sender, 'dp', body.profile_pic);
					            saveinDB(sender, 'Gender', body.gender);
					            saveinDB(sender, 'University', 'none');
					            saveinDB(sender, 'Phone', 'none');
					            saveinDB(sender, 'Progress', 0)
					        }
					    });
				}else{
					//sendText(sender, "Hello Mr. " + cuser.Name.value)
					if(text === 'generic'){
						sendGenericMessage(sender)
					}
					if(cuser.Progress.value === 0){
						if(text.includes("itu") || text.includes("information technology") || text.includes("arfa") || text.includes("plan9")){
								saveinDB(sender, 'University', 'ITU')
								saveinDB(sender, 'Progress', cuser.Progress.value + 1)
								sendText(sender, "ITU University save kr li gyi hai. Apko apka order Mubeen Ikram pohncha dengay.")	
								setTimeout(askMobileNumber(sender), 3000)
						}
						else if(text.includes("comsats")){
								saveinDB(sender, 'University', 'COMSATS')
								saveinDB(sender, 'Progress', cuser.Progress.value + 1)
								sendText(sender, "COMSATS University save kr li gyi hai. Apko apka order Khunshan Butt pohncha dengay.")	
								setTimeout(function() { askMobileNumber(sender) }, 3000)
						}
						else if(text.includes("fast university") || text.includes("fast lahore") || 
							text.includes("fast-nu") || text.includes("nuces") || text.includes("fastnu")
							|| (text.includes("fast") && (text.includes("university") || text.includes("uni")) || text === 'fast')){
								saveinDB(sender, 'University', 'Fast-NU')
								saveinDB(sender, 'Progress', cuser.Progress.value + 1)
								sendText(sender, "FAST University save kr li gyi hai. Apko apka order Mohsin Hayat pohncha dengay.")	
								setTimeout(function() { askMobileNumber(sender) }, 3000)
						}
						else if(text.includes("pucit - new") || text.includes("punjab university")){
							saveinDB(sender, 'University', 'PUCIT (New)')
							saveinDB(sender, 'Progress', cuser.Progress.value + 1)
							sendText(sender, "PUCIT New Campus save kr li gyi hai. Apko apka order Mustaghees Butt pohncha dengay.")	
							setTimeout(function() { askMobileNumber(sender) }, 3000)
						}else if(text === "inmay se koi nai" || text === "none"){
							saveinDB(sender, 'University', 'no university')
							saveinDB(sender, 'Progress', cuser.Progress.value + 1)
							sendText(sender, "Aapki University jald shamil kr li jayegi. Filhal 5 universities cover ki ja rhi hain. :)")
							setTimeout(function() { askMobileNumber(sender) }, 3000)
						}
						else{
							askUniversity(sender)
						}
					}
					if(cuser.Progress.value === 1){

						const phNum = firstEntity(guess, 'phone_number');
						if (phNum && phNum.confidence > 0.8 && phNum.value.length > 10 && phNum.value.length < 15) {
							//let phn = text.substring(phNum.start, phNum.end)
								saveinDB(sender, 'Phone', phNum.value)
								saveinDB(sender, 'Progress', cuser.Progress.value + 1)
			    				sendText(sender, "Aapka mobile number darj kr lia gya hai: " + phNum.value + ". Mustaqbil main issi number pr tafseelat di jayengi.")
			 			}else{
			 				
			 				askMobileNumber(sender)
			 			}
					}
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
		 			const byed = firstEntity(guess, 'bye');
					if (byed && byed.confidence > 0.8) {
			    		sendText(sender, "Shukria. Khuda Hafiz!")
			 		}
			 		if(intent && intent.confidence > 0.7){
		 				if(intent.value == "asking_website"){
		 					sendText(sender, "Hamari website purzey.pk hai jo abhi bnnay k marahil main hai. Aap Facebook k zariye sb kuch order kr sktay hain." )	
		 				}
		 				if(intent.value == "asking_email"){
		 					sendText(sender, "You can email us at our email address: info@purzey.pk")
		 				}
		 				if(intent.value == 'slang'){
		 					sendText(sender, ":D :P")
		 				}
		 				if(intent.value == 'product_inquiry'){
		 					sendText(sender, "Aapka sawal darj kr lia gya, brah-e-mehrbani intazar farmaiye.")
		 				}
		 				if(intent.value == 'abuse'){
		 					sendText(sender, "Abusing will cause a permanent ban.")
		 				}
		 				if(intent.value == 'order_received'){
		 					sendText(sender, "Have a good day :) Kindly rate our services and share Purzey with your friends.")
		 				}
		 				if(intent.value == 'asking_phone'){
		 					sendText(sender, "Hamaray inn numbers pr contact kijiye:\n03364256811\n03214441444")
		 				}
		 				if(intent.value == 'wantsToBecomeCA'){
		 					sendText(sender, "Agar aap campus ambassador bnna chahtay hain to apna cnic, phone number, university ka naam aur aik chotay se paragraph jismay ap btayen k aap Purzey kiun join krna chahtay hain, humain chat pr bhejain. Aap ko reply kr dia jayega :)")
		 				}
		 				if(intent.value == 'asking_selfName'){
		 					sendText(sender, "Aapka naam " + cuser.Name.value + " hai.")
		 				}
		 				if(intent.value == 'asking_delivery'){
		 					sendText(sender, "Aap ko aapki delivery " + cuser.University.value + " main tehh krda time pr pohncha di jayegi. Wait kijiye :)")
		 				}
		 				if(intent.value == 'order_cancel'){
		 					sendText(sender, "Kya aap order cancel krna chahtay hain?")
		 				}
		 				if(intent.value == 'product_inquiry'){
		 					sendText(sender, "Iss product k baray main apka sawal note kr lia gya hai. Brah-e-mehrbani wait kijiye :)")
		 				}
		 				if(intent.value == 'custom_order'){
		 					sendText(sender, "Custom Order main apni product ka naam aur identification main asani ki liye koi link ya picture bhej dein. Hum aapko apki tafseelat jald muhayya krein gay. Shukria :)")
		 				}
		 				if(intent.value == 'greeting_answer'){
		 					sendText(sender, "How may I help you? :)")
		 				}
		 				if(intent.value == 'shouting_name'){
		 					sendText(sender, "Puurrrzeeeey!!!")
		 				}
		 				if(intent.value == 'asking_ca'){
		 					var CAM = ""
		 					if(cuser.University.value === "Fast-NU"){CAM = "Mohsin Hayat"}
		 					if(cuser.University.value === "ITU"){CAM = "Mubeen Ikram"}
		 					if(cuser.University.value === "COMSATS"){CAM = "Khunshan Butt"}
		 					if(cuser.University.value === "PUCIT (New)"){CAM = "Mustaghees Butt"}
		 					if(CAM !== ""){	
		 						sendText(sender, "Aap ki university k Campus Ambassador " + CAM + " hain.")
		 					}
		 				}
		 				if(intent.value == 'asking_howtoorder'){
		 					orderKrain(sender)
		 					
		 				}
		 				if(intent.value == 'asking_botName'){
		 					sendText(sender, "Mera naam HoverBot hai")
		 				}
		 				if(intent.value == 'asking_botAge'){
		 					sendText(sender, "BOT ki age jaan kr kya krogay bhai?")
		 				}
		 				if(intent.value == 'showproduct_best'){
		 					const gproduct = firstEntity(guess, 'product')
		 					if(gproduct){
		 						if(gproduct.value === 'Handsfree'){
		 							getProduct('AKG Earphones')
									.then((prd) => {
										if(prd !== null){
											sendText(sender, "Although sb market se handpicked hain aur achi hain. Hum apko AKG handsfree recommend krtay hain.")
											productOffer(sender, prd)
										}
									})
		 						}
		 					}else{
		 						sendText(sender, "Aap shop se pasand kr k btayiye please.")
		 					}
		 				}
		 				if(intent.value == 'showproduct_cheapest'){
		 					const g2product = firstEntity(guess, 'product')
		 					if(g2product){
		 						if(g2product.value === 'Handsfree'){
		 							getProduct('Samsung Handsfree')
									.then((prd) => {
										if(prd !== null){
											sendText(sender, "Sab say sasti handsfree hamaray pas Samsung Handsfree hai.")
											productOffer(sender, prd)
										}
									})
		 						}
		 					}else{
		 						sendText(sender, "Aap shop se pasand kr k btayiye please.")
		 					}
		 				}
		 			}

		 			if(intent && intent.confidence > 0.8){ //PRODUCT GUESS!
		 				if(intent.value === 'order'){
		 					sendText(sender, "Products k naam aur quantity mention kr dijiye, kuch der main order confirm kr dia jayega.")
		 					const product = nlp.entities['product']
		 					if(product && product.confidence > 0.8){
		 						let t32 = ""
								for(var key1 in product) {
								    t32 = t32 + product[key1].value + "\n"
								}
								//JSON.stringify(prod)
								sendText(sender, "You have ordered:\n" + t32)
		 					}
		 				}
		 			}

		 			if(text.includes("aoa") || text.includes("salam") || text.includes("aslam") || text.includes("aslamualaikum")){
						sendText(sender, "Walaikum-Asalam!")
					}
				}
			})		
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


function askMobileNumber(sender){
let messageData = {
	     "text": "Apna mobile number enter kijiye, takay apsay contact krnay main asani ho.",
	    "quick_replies":[
	      {
			"content_type":"user_phone_number"
	      }
	    ]
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

function orderKrain(sender) {
    let messageData = {
	 "attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text":"Order krnay k liye hamari shop pr jayen aur koi product select kr k humain msg krain.",
	        "buttons":[
	          {
	            "type":"web_url",
	            "url":"https://www.facebook.com/purzey/shop",
	            "title":"Goto Shop",
	            "webview_height_ratio": "full"
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


function askUniversity(sender) {
    let messageData = {
	     "text": "Apni university ka naam btayen?",
	    "quick_replies":[
	      {
	        "content_type":"text",
	        "title":"ITU",
	        "payload":"uni_ITU",
	      },
	      {
	        "content_type":"text",
	        "title":"FAST-NU",
	        "payload":"uni_NU",
	      },
	      {
	        "content_type":"text",
	        "title":"COMSATS",
	        "payload":"uni_COM",
	      },
	      {
	        "content_type":"text",
	        "title":"PUCIT - NEW",
	        "payload":"uni_PUnew",
	      },
	      {
	        "content_type":"text",
	        "title":"UMT",
	        "payload":"uni_UMT",
	      },
	      {
	        "content_type":"text",
	        "title":"Inmay se koi nai",
	        "payload":"uni_none",
	      }
	    ]
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
function askShuruKrain(sender) {
    let messageData = {
	 "attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text":"Purzey main khushaamdid! Purzey se baat shuru kijiye.",
	        "buttons":[
	          {
	            "type":"text",
	            "title":"Shuru Krain",
	            "payload":"shuru"
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

function getProduct(prdName){
     var db = admin.database()
     var collectionRef = db.ref('products')
     var ref = collectionRef.child(prdName)
     return ref.once('value')
         .then((snapshot) => {
             return snapshot.val()
         })
}

function getUserProfile(senderID){
	 var db = admin.database()
     var msgnrRef = db.ref("server/messenger");
     var ref = msgnrRef.child("customer " + senderID)
     return ref.once('value')
         .then((snapshot) => {
             return snapshot.val()
         })
}

function productOffer(sender, prd) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": prd.name,
				    "subtitle": prd.price + ".00rs only",
				    "image_url": prd.img,
				    "buttons": [{
					    "type": "web_url",
					    "url": prd.link,
					    "title": "View"
				    }, {
					    "type": "postback",
					    "title": "Order",
					    "payload": "ordering a product",
				    }],
			    }]
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


function sendGenericMessage(sender) {
    let messageData = {
	    "attachment": {
		    "type": "template",
		    "payload": {
				"template_type": "generic",
			    "elements": [{
					"title": "UGREEN Data Cable 3 Meter Long",
				    "subtitle": "This 3 meter long cable allows you to reach your phone all the way from your bed.",
				    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				    "buttons": [{
					    "type": "web_url",
					    "url": "https://www.facebook.com/commerce/products/1811144608910173/",
					    "title": "web url"
				    }, {
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for first element in a generic bubble",
				    }],
			    }, {
				    "title": "Second card",
				    "subtitle": "Element #2 of an hscroll",
				    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				    "buttons": [{
					    "type": "postback",
					    "title": "Postback",
					    "payload": "Payload for second element in a generic bubble",
				    }],
			    }]
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



function sendContactInfo(sender) {
    let messageData = {
	    	"attachment":{
		      "type":"template",
		      "payload":{
		        "template_type":"button",
		        "text":"Hamaray se rabta krnay k liye:\nEmail: info@purzey.pk\nPhone: 03214441444 or 03364256811\n\nYa issi chat k zariye rabta krein.",
		        "buttons":[
		          {
		            "type":"phone_number",
		            "title":"Call Purzey",
		            "payload":"+923364256811"
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

function sendTypingOn(sender){
	request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    sender_action: "typing_on",
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendTypingOff(sender){
	request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    sender_action: "typing_off",
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}

function sendMarkSeen(sender){
	request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
	    json: {
		    recipient: {id:sender},
		    sender_action: "mark_seen",
	    }
    }, function(error, response, body) {
	    if (error) {
		    console.log('Error sending messages: ', error)
	    } else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}
