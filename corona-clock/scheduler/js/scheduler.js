
/*
Scheduler for Hotchkiss Clock Corona Edition
Nicholas Lorentzen
Last updated 2020 03 29
*/
var boiyardee = [];
var classes = ["m1","m2","m3","t5","t6","t7","t8","t3","s4","w2","y3","y5","y6","f1", "y2", "f8", "name", "timezone"];
var coronaclasses = {a1: "m1", a2: "t5", a3: "t3", a4: "y3", b1: "m2", b2: "t7", b3: "s4", b4: "y5", b5: "f1", c1: "m3", c2: "t8", c3: "w2", c4: "f8", c5: "y2"};

var abConflictMessage = "WARNING: Please make sure you only fill out periods for which you actually have class. It looks like you have both 5A and 5B filled out on a day. This program will automatically handle free periods in the live view clock mode.";

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
	//Check Tuesday 5A 5B Conflicts
	var aVal = document.getElementById("t5").value.toLowerCase();
	var bVal = document.getElementById("t6").value.toLowerCase();
	if ((aVal != "" && bVal != "") && (aVal != "lunch" && bVal != "lunch")) {
		window.alert(abConflictMessage);
		return;
	}

	//Check Thursday 5A 5B Conflicts
	aVal = document.getElementById("y5").value.toLowerCase();
	bVal = document.getElementById("y6").value.toLowerCase();
	if ((aVal != "" && bVal != "") && (aVal != "lunch" && bVal != "lunch")) {
		window.alert(abConflictMessage);
		return;
	}

	putCookie();	
	loadCoronaSchedule();
	//window.location.href = "https://ekkoing.github.io/cclock/corona-clock/scheduler";
}

function cookiesAlert()
{
	window.alert("Welcome to the scheduler! In order to use this service you will need cookies enabled. Note that any data entered here cannot be read from any other computer and exists purely on your device. This means that all data must be entered on each device separately until I come up with a more elegant solution - Nicholas Lorentzen '20");
	
	classes.forEach(fillTable);
	loadCoronaSchedule();
}

function fillTable(chef)
{
	var cellVal = getCookie(chef);
	if (cellVal === "Lunch" || cellVal === "Free") {
		cellVal = "";
	}

	if (chef === "timezone") {
		cellVal = getHotchkissOffset();
	}

	document.getElementById(chef).value = cellVal;
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

function loadCoronaSchedule() 
{
	//if (document.cookie === "") {return;}
	for(var key in coronaclasses) {
		var cellValue = "";
		if (coronaclasses[key].charAt(1) === '5') {
			var dayKey = coronaclasses[key].charAt(0);
			var aVal = document.getElementById(dayKey + "5").value;
			var bVal = document.getElementById(dayKey + "6").value;
			if (aVal === "" || aVal.toLowerCase() === "lunch" ||aVal.toLowerCase() === "free") {
				cellValue = bVal;
			} else {
				cellValue = aVal;
			}
		} else {
			cellValue = document.getElementById(coronaclasses[key]).value;
		}

		if (cellValue != "") {
			document.getElementById(key).innerHTML = cellValue;
		}
	}

	adjustTimezone();
}

function adjustTimezone() {

	if(isNaN(getCookie("timezone")) &&  isNaN(document.getElementById("timezone").value)) {return;}

	var timezone = parseInt(document.getElementById("timezone").value);

	if(isNaN(timezone)) {return;}

	var aTime = [0, 9, 30, 10, 15];
	var bTime = [1, 10, 25, 11, 10];
	var cTime = [2, 11, 20, 12, 05];
	var dTime = [3, 12, 15, 12, 35];
	var allTimes = [aTime, bTime, cTime, dTime];

	var elementIDs = ["atime", "btime", "ctime", "dtime"];

	for(var i = 0; i < allTimes.length; i++) {
		var timePeriod = allTimes[i];

		var timePeriod1Val = (timePeriod[1] + timezone);
		var timePeriod3Val = (timePeriod[3] + timezone);

		if (timePeriod1Val % 12 != 0) {timePeriod1Val = timePeriod1Val % 12;} else {timePeriod1Val = 12;}
		if (timePeriod3Val % 12 != 0) {timePeriod3Val = timePeriod3Val % 12;} else {timePeriod3Val = 12;}

		timePeriod[1] = timePeriod1Val;
		timePeriod[3] = timePeriod3Val;

		var idOfElement = elementIDs[timePeriod[0]];

		document.getElementById(idOfElement).innerHTML = `${timePeriod[1]}:${timePeriod[2]} - ${timePeriod[3]}:${padNumber(timePeriod[4])}`;
	}
}

function getHotchkissOffset() {
    var offset = new Date().getTimezoneOffset();
    var offsetHours = offset / -60;
    var hotchkissOffset = parseInt("" + (offsetHours + 4));
    return hotchkissOffset;
}

function padNumber(num) {
	if (num < 10) {
		return `0${num}`;
	} else {
		return `${num}`;
	}
}

