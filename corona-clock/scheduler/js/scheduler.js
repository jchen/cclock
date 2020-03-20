
/*
Scheduler for Hotchkiss Clock
Nicholas Lorentzen
Last updated 2019 04 15
*/
var boiyardee = [];
var classes = ["m1","m2","m3","t5","t6","t7","t8","t3","s4","w2","y3","y5","y6","y8","f1", "name", "timezone"];

function addCookie(cookname)
{

	boiyardee.push(cookname);
	document.cookie = cookname + ";domain=ekkoing.github.io;max-age=31536000;path=/";
}

function bakeCookies(recipe)
{
	var cookieValue = document.getElementById(recipe).value
	if ((recipe.includes(5) || recipe.includes(6)) && cookieValue === ""){
		cookieValue = "Lunch";
	}
	if (cookieValue === "" && !recipe.includes("name")){
		cookieValue = "Free";
	}
	
	addCookie(recipe + "=" + escape(cookieValue));
}

function putCookie()
{
	classes.forEach(bakeCookies);
	console.log (boiyardee.join(";") + ";domain=ekkoing.github.io;max-age=31536000;path=/");
	document.cookie = boiyardee.join(";") + ";domain=ekkoing.github.io;max-age=31536000;path=/";
	return true;
}

function exitScheduler()
{
	putCookie();	
	alert("Schedule Updated!");
	window.location.href = "https://ekkoing.github.io/cclock/corona-clock/scheduler";
}

function cookiesAlert()
{
	window.alert("Welcome to the scheduler! In order to use this service you will need cookies enabled. Note that any data entered here cannot be read from any other computer and exists purely on your device. This means that all data must be entered on each device separately until I come up with a more elegant solution - Nicholas Lorentzen '20");
	
	classes.forEach(fillTable);
}

function fillTable(chef)
{
	document.getElementById(chef).value = getCookie(chef);
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return unescape(c.substring(name.length, c.length));
    }
  }
  return "";
}

function updateScheduler()
{
	document.cookie = document.getElementById("pasteCode").value + ";domain=ekkoing.github.io;max-age=31536000;path=/";
	alert(document.cookie);
}