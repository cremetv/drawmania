/*! @license
* Drawmania
* Discord Bot Web Interface
* © 2019 Marcel Hauser (https://ice-creme.de)
*/
//@prepros-append pages/index.js


// scroll messages
const chat = $('#chat');
const scrollMessages = () => {
  let scrollHeight = chat[0].scrollHeight;
  TweenLite.to(chat, 2, {
		scrollTo: scrollHeight,
		ease:Power2.easeOut
	});
}

// Console Badge =)
$(function() {
	var t = navigator.userAgent.toLowerCase();
	if (/(chrome|firefox|safari)/.test(t.toLowerCase())) {
		var e = ["padding: 20px 5px 16px", "background-color: #36393E", "color: #f2641c"].join(";");
		var i = ["padding: 20px 5px 16px", "background-color: #f2641c", "color: #ffffff"].join(";"),
				n = ["background-color: transparent"].join(";");
		console.log("\n\n %c Crafted with ♥︎ by Ice Creme %c https://ice-creme.de/ %c \n\n\n", e, i, n);
	} else {
		window.console && console.log("Crafted with love by Ice Creme - https://ice-creme.de/");
	}
});
