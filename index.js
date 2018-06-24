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
		if(event.message && event.message.text){
 			getUserProfile(event.sender.id+5)
			.then((cuser) => {
				if(cuser === null){
					sendText(sender, "Purzey main khush-aamdid! Kuch order krnay k liye apko kuch sawalat kay jawab denay hongay.")
					var request = require('request');
					var usersPublicProfile = 'https://graph.facebook.com/v2.6/' + sender +
					'?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token='
					+ token;
					request({
					    url: usersPublicProfile,
					    json: true // parse
					}, function (error, response, body) {
					        if (!error && response.statusCode === 200) {
					        saveinDB(sender+5, 'Name', body.first_name + ' ' + body.last_name);
					            saveinDB(sender+5, 'dp', body.profile_pic);
					            saveinDB(sender+5, 'Gender', body.gender);
					        }
					    });
				}else{
					sendText(sender, "Hello Mr. " + cuser.Name.value)
				}
			})		
			continue;
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

function getUserProfile(senderID){
	 var db = admin.database()
     var msgnrRef = db.ref("server/messenger");
     var ref = msgnrRef.child("customer " + senderID)
     return ref.once('value')
         .then((snapshot) => {
             return snapshot.val()
         })
}