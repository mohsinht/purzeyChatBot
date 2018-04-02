var order = require('./index.js')

exports.checkOrder = function(sender, text){
	if(text.includes("handsfree")){
		sendText(sender, "You talked about handsfree :)")
	}
}
