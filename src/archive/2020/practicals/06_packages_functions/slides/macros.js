 remark.macros.attend = function(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	let pin = urlParams.get("pin") || "";
	return '<p style="font-size:2em;text-align:center">The attendence pin is:</p><p style="font-size:4em;text-align:center">' + pin +'</p>';
 }
