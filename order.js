var index = require('./index.js')

exports.checkOrder = function(sender, text){
	if(text.includes("handsfree")){
		index.sendText(sender, "You talked about handsfree :)")
	}
}
