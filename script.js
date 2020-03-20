/*
Controller for clock/time webapp
Nicholas Lorentzen, Jiahua Chen, based off Eric Li's original design
Last updated 26 August 2019
*/

// Gets the current date and time
var d = new Date();
//var d = new Date(2019,8,26,14,30,1,0);
// console.log(" *** d.getDate() " + d.getDate());
// console.log(" *** d.getMonth() " + d.getMonth());
// console.log(" *** dayType noClassSats" + i);
window.location.href = "https://ekkoing.github.io/cclock/corona-clock";

// Updates the date and time
function updateD() {
    d = new Date();
}

var showTime = true;
var descText;
var weekendText = "";
var mainMessage = "";

// Gets the classification of the date, and returns 0 if it is a normal day. Also contains dictionaries for special days.

// Defines the special days
var onbreak = false;
var specialDays = [new CalDay(10, 12), new CalDay(11, 23)]; // <- For special event days
var noClassSats = [new CalDay(9, 14), new CalDay(10, 5), new CalDay(11, 2), new CalDay(12, 7)]; // <- For days without Saturday classes
var noClassDays = [new CalDay(5, 27), new CalDay(6, 1)]; // <- For days without classes, or breaks
var holidayDays = [new CalDay(10, 14), new CalDay(10, 15), new CalDay(12, 2)]; // <- For holidays

//What the current period's array location is
var currentArrayLoc = 0;


function dayType() {
	var i = 0;
    for (i = 0; i < specialDays.length; i++) {
        if (specialDays[i].month === d.getMonth() && specialDays[i].date === d.getDate()) {
            return 1;
        }
        // console.log(" *** specialDays[i].month " + specialDays[i].month);
        // console.log(" *** specialDays[i].date " + specialDays[i].date);
        // console.log(" *** dayType specialDays " + i);
    }

    for (i = 0; i < noClassSats.length; i++) {
        if (noClassSats[i].month === d.getMonth() && noClassSats[i].date === d.getDate()) {
            return 2;
        }
        // console.log(" *** dayType noClassSats " + i);
    }

    for (i = 0; i < noClassDays.length; i++) {
        if (noClassDays[i].month === d.getMonth() && noClassDays[i].date === d.getDate()) {
            return 3;
        }
        // console.log(" *** dayType noClassDays " + i);
    }

    for (i = 0; i < holiday.length; i++) {
        if (holidayDays[i].month === d.getMonth() && holidayDays[i].date === d.getDate()) {
            return 4;
        }
        // console.log(" *** dayType holiday " + i);
    }

    if (onbreak) {
        return 5;
    } else {
        return 0;
    }
}

function loadTime() {
    //d = new Date();
    // Adjusts into AM and PM time
    var hr = ((d.getHours() + 11) % 12 + 1);
    var sufx = (d.getHours() >= 12) ? 'PM' : 'AM';

    // Outputs to HTML
    document.getElementById("clock").innerHTML = hr + ":" + ("0" + d.getMinutes()).slice(-2) + " " + sufx;
}

function loadDate() {
    // Dictionary for text-based date
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Outputs to HTML
    descText = days[d.getDay()];
}

// Below mostly code from Eric Li '13

// Defines a Period
function Period(title, startHr, startMin, endHr, endMin) {
    this.title = title;
    this.startHr = startHr;
    this.startMin = startMin;
    this.startRaw = startHr * 3600 + startMin * 60;
    this.endHr = endHr;
    this.endMin = endMin;
    this.endRaw = endHr * 3600 + endMin * 60;
}

function CalDay(month, date) {
    this.date = date;
    // console.log(this.date);
    this.month = month - 1;
    // console.log(this.month);
}

// Updates the clock messages
function update() {
	var i = 0;
    // Stores the dayType
    var type = dayType();
    // Debug ***
    // console.log(type);
    // Checks for special days
    if (type === 1) {
        specialSchedule();
    } else if (type === 2) {
        noClassSat();
    } else if (type === 3) {
        noClasses();
    } else if (type === 4) {
        holiday();
    } else if (type === 5) {
        schoolBreak();
    } else if (type === 0) {
        // console.log(" *** Is normal day");
        // Gets today's schedule
        var currentSchedule = getSchedule(d.getDay());
        // console.log(" *** currentSchedule " + currentSchedule.length);

        // Checks which Period it currently is
        for (i = 0; i < currentSchedule.length; i++) {
            // console.log(" *** for i " + i);
            // console.log(" *** parseRaw " + parseRaw());

            if (parseRaw() < currentSchedule[0].startRaw) {
                beforeSchool(currentSchedule[0].title, currentSchedule[0].startRaw - parseRaw());
            }

            if (currentSchedule[i].startRaw < parseRaw() && parseRaw() < currentSchedule[i].endRaw) {
                // console.log(" *** currentSchedule[i].startRaw " + currentSchedule[i].startRaw);
				currentArrayLoc = i;
                if (currentSchedule[i].title === "Passing Period") {
                    normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 1].title, currentSchedule[i + 1].startRaw - parseRaw());
                } else {
                    normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 2].title, currentSchedule[i + 2].startRaw - parseRaw());
                }
            }
			
            if (parseRaw() > currentSchedule[currentSchedule.length - 1].endRaw) {
				currentArrayLoc = currentSchedule.length + 1;
                showTime = true;
                document.getElementById("class-info").innerHTML = "";
                document.getElementById("schedule-info").innerHTML = descText + "<b> ⋅ Have a nice day!</b>";
            }
        }
		previewTableCreate();
    }
    if (showTime) {
        document.getElementById("hrs").style.display = "block";
        var rawTime = parseRaw();
        document.documentElement.style.setProperty('--timer-hours', "'" + toHrs(rawTime).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + "'");
        document.documentElement.style.setProperty('--timer-minutes', "'" + toMins(rawTime).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + "'");
        document.documentElement.style.setProperty('--timer-seconds', "'" + toSecs(rawTime).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + "'");
    }

    // Code to change the Document Title, disabled for now.
    // document.title = "Hotchkiss Clock ⋅ " + toHrs(rawTime).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    // }) + ":" + toMins(rawTime).toLocaleString('en-US', {
    //     minimumIntegerDigits: 2,
    //     useGrouping: false
    // }) + ":" + toSecs(rawTime).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
}

// Gets the right schedule for a regular class day
function getSchedule(weekday) {
    // console.log(" *** d.getDate() " + d.getDay());
	
    // Defines the currentSchedule array
    var currentSchedule = [];

    // Assigns class schedules for weekday scenarios
    if (weekday === 1 || weekday === 4) {
        currentSchedule[0] = new Period("Period 1", 8, 30, 9, 15);
        currentSchedule[1] = new Period("→ Period 2", 9, 15, 9, 20);
        currentSchedule[2] = new Period("Period 2", 9, 20, 10, 5);
        currentSchedule[3] = new Period("→ Chapel / Class Meeting", 10, 5, 10, 10);
        currentSchedule[4] = new Period("Chapel / Class Meeting", 10, 10, 10, 35);
        currentSchedule[5] = new Period("→ Period 3", 10, 35, 10, 40);
        currentSchedule[6] = new Period("Period 3", 10, 40, 11, 20);
        currentSchedule[7] = new Period("→ Period 4", 11, 20, 11, 25);
        currentSchedule[8] = new Period("Period 4", 11, 25, 12, 5);
        currentSchedule[9] = new Period("→ Period 5A", 12, 5, 12, 10);
        currentSchedule[10] = new Period("Period 5A", 12, 10, 12, 55);
        currentSchedule[11] = new Period("Lunch Bell", 12, 55, 12, 55);
        currentSchedule[12] = new Period("Period 5B", 12, 55, 13, 40);
        currentSchedule[13] = new Period("→ Period 6", 13, 40, 13, 45);
        currentSchedule[14] = new Period("Period 6", 13, 45, 14, 30);
        currentSchedule[15] = new Period("→ Period 7", 14, 30, 14, 35);
        currentSchedule[16] = new Period("Period 7", 14, 35, 15, 20);
        currentSchedule[17] = new Period("end of school", 15, 20, 15, 20);
        currentSchedule[18] = new Period("end of school", 15, 20, 15, 20);
    } else if (weekday === 2 || weekday === 5) {
        currentSchedule[0] = new Period("Period 1", 8, 30, 9, 10);
        currentSchedule[1] = new Period("→ Period 2", 9, 10, 9, 15);
        currentSchedule[2] = new Period("Period 2", 9, 15, 9, 55);
        currentSchedule[3] = new Period("→ Auditorium", 9, 55, 10, 0);
        currentSchedule[4] = new Period("Auditorium", 10, 0, 10, 35);
        currentSchedule[5] = new Period("→ Period 3", 10, 35, 10, 40);
        currentSchedule[6] = new Period("Period 3", 10, 40, 11, 20);
        currentSchedule[7] = new Period("→ Period 4", 11, 20, 11, 25);
        currentSchedule[8] = new Period("Period 4", 11, 25, 12, 5);
        currentSchedule[9] = new Period("→ Period 5A", 12, 5, 12, 10);
        currentSchedule[10] = new Period("Period 5A", 12, 10, 12, 55);
        currentSchedule[11] = new Period("Lunch Bell", 12, 55, 12, 55);
        currentSchedule[12] = new Period("Period 5B", 12, 55, 13, 40);
        currentSchedule[13] = new Period("→ Period 6", 13, 40, 13, 45);
        currentSchedule[14] = new Period("Period 6", 13, 45, 14, 30);
        currentSchedule[15] = new Period("→ Period 7", 14, 30, 14, 35);
        currentSchedule[16] = new Period("Period 7", 14, 35, 15, 20);
        currentSchedule[17] = new Period("end of school", 15, 20, 15, 20);
        currentSchedule[18] = new Period("end of school", 15, 20, 15, 20);
    } else if (weekday === 3) {
        currentSchedule[0] = new Period("Period 1", 8, 50, 9, 35);
        currentSchedule[1] = new Period("→ Period 2", 9, 35, 9, 40);
        currentSchedule[2] = new Period("Period 2", 9, 40, 10, 25);
        currentSchedule[3] = new Period("→ Advisory", 10, 25, 10, 30);
        currentSchedule[4] = new Period("Advisory", 10, 30, 10, 45);
        currentSchedule[5] = new Period("→ Period 3", 10, 45, 10, 50);
        currentSchedule[6] = new Period("Period 3", 10, 50, 11, 30);
        currentSchedule[7] = new Period("→ Period 4", 11, 30, 11, 35);
        currentSchedule[8] = new Period("Period 4", 11, 35, 12, 15);
        currentSchedule[9] = new Period("end of school", 12, 15, 12, 15);
        currentSchedule[10] = new Period("end of school", 12, 15, 12, 15);
    } else if (weekday === 6) {
        currentSchedule[0] = new Period("Period 1", 8, 30, 9, 15);
        currentSchedule[1] = new Period("→ Period 2", 9, 15, 9, 20);
        currentSchedule[2] = new Period("Period 2", 9, 20, 10, 5);
        currentSchedule[3] = new Period("Break", 10, 5, 10, 20);
        currentSchedule[4] = new Period("Period 3", 10, 20, 11, 5);
        currentSchedule[5] = new Period("→ Period 4", 11, 5, 11, 10);
        currentSchedule[6] = new Period("Period 4", 11, 10, 11, 55);
        currentSchedule[7] = new Period("end of school", 11, 55, 11, 55);
        currentSchedule[8] = new Period("end of school", 11, 55, 11, 55);
    } else {
        noClasses();
    }
	
	return cookieCheck(currentSchedule, weekday);
}

function specialSchedule() // <- What to print during special schedules
{
    document.getElementById("class-info").innerHTML = "<i>Special Schedule</i>";
    document.getElementById("schedule-info").innerHTML = "Please consult your email for details.";
}

function noClassSat() // <- What to print for no-class Saturdays
{
    document.getElementById("class-info").innerHTML = "";
    document.getElementById("schedule-info").innerHTML = descText + "<b> ⋅ No-class Saturday</b>";
}

function noClasses() // <- What to print when no classes
{
    document.getElementById("class-info").innerHTML = "";
    document.getElementById("schedule-info").innerHTML = descText + "<b> ⋅ No Class</b>";
}

function holiday() // <- What to print during holidays
{
    document.getElementById("class-info").innerHTML = "Holiday";
    document.getElementById("schedule-info").innerHTML = "Enjoy your holiday!";
}

function schoolBreak() // <- What to print during school breaks
{
    document.getElementById("class-info").innerHTML = "Break";
    document.getElementById("schedule-info").innerHTML = "Enjoy your break!";
}

function normalDay(nowTitle, nowDiff, nextTitle, nextDiff) // <- What to print during normal days
{
    document.getElementById("class-info").innerHTML = nowTitle;
    document.getElementById("schedule-info").innerHTML = descText + weekendText;
    printTime(nowDiff);
}

function beforeSchool(title, time) {
    document.getElementById("class-info").innerHTML = title;
    document.getElementById("schedule-info").innerHTML = descText + weekendText;
    printTime(time);
}

function thisWeekend() {
    for (var addDay = 0; addDay < 7; addDay++) {
        var result = d;
        result.setDate(result.getDate() + addDay);
        for (var i = 0; i < noClassSats.length; i++) {
            if (noClassSats[i].month === result.getMonth() && noClassSats[i].date === result.getDate()) {
                return "<b> ⋅ No-Class Weekend</b>";
            }
        }
    }
    return "<b> ⋅ Normal Weekend</b>";
}

function parseRaw() {
    return d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds();
}

function printTime(raw) {
    showTime = false;
    if (toHrs(raw) === 0) {
        document.getElementById("hrs").style.display = "none";
    } else {
        document.documentElement.style.setProperty('--timer-hours', "'" + toHrs(raw).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + "'");
    }
    document.documentElement.style.setProperty('--timer-minutes', "'" + toMins(raw).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + "'");
    document.documentElement.style.setProperty('--timer-seconds', "'" + toSecs(raw).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    }) + "'");
}

function toMins(raw) {
    return Math.floor((raw % 3600) / 60);
}

function toHrs(raw) {
    return Math.floor(raw / 3600);
}

function toSecs(raw) {
    return (raw % 60);
}

// Converts raw time format to a parsed time string (DEPRECATED)
/*
function rawToString(raw) {
    var output = "";

    if (toHrs(raw) === 0) {
    } else if (toHrs(raw) === 1) {
        output += toHrs(raw) + " hour ";
    } else {
        output += toHrs(raw) + " hours ";
    }

    if (showSeconds) {
        if (toMins(raw) === 0) {
            if (toSecs(raw) === 1) {
                output += toSecs(raw) + " second";
            } else {
                output += toSecs(raw) + " seconds";
            }
        } else if (toMins(raw) === 1) {
            output += toMins(raw) + " minute ";
            if (toSecs(raw) === 1) {
                output += toSecs(raw) + " second";
            } else {
                output += toSecs(raw) + " seconds";
            }
        } else {
            output += toMins(raw) + " minutes ";
            if (toSecs(raw) === 1) {
                output += toSecs(raw) + " second";
            } else {
                output += toSecs(raw) + " seconds";
            }
        }
    } else {
        var ceilMins = toMins(raw) + 1;
        if (toMins(raw) === 0) {
            output += ceilMins + " minute";
        } else {
            output += ceilMins + " minutes";
        }
    }
    return output;
}
*/

window.addEventListener('load', onLoad);

function onLoad() {
    //d = new Date();
    loadTime();
    loadDate();
    update();
    weekendText = thisWeekend();
	document.getElementById("schedule-message").style.display = "block";
}

// Below Code from Nicholas Lorentzen '20
//This code was added to add the functionality of inputting a schedule

//Some code off a website to check cookies
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

function cookieCheck(scheduleToCheck, weekday)
{
	var cookieAbbrev = ["m", "t", "w", "y", "f", "s"];
	var currentAbbrev = cookieAbbrev[weekday - 1];
	
	for(var i = 0; i < scheduleToCheck.length; i++){
		var currentPeriod = scheduleToCheck[i];
		var currentPeriodName = currentPeriod.title;
		var addArrow = false;
		if(currentPeriodName.includes("→")){
			addArrow = true;
		}
		if(currentPeriodName.includes("Period")){
			var numIdx = 7;
			if(addArrow) {numIdx = 9;}
			var currentPeriodNum = parseInt(currentPeriodName.charAt(numIdx));
			if(currentPeriodNum > 5){currentPeriodNum = currentPeriodNum + 1;}
			if(currentPeriodName.includes("5B")){currentPeriodNum = 6;}
			if(!(getCookie(currentAbbrev + currentPeriodNum) === "")){
				currentPeriodName = getCookie(currentAbbrev + currentPeriodNum);
				if(addArrow){currentPeriodName = "→ " + currentPeriodName;}
			}
			currentPeriod.title = currentPeriodName;
			scheduleToCheck[i] = currentPeriod;
		}
	}
	return scheduleToCheck;
}

//Adds Schedule Preview and Custom Messages
function previewTableCreate() {
	//if(document.cookie === "") {return;}
	var myArrayLoc = currentArrayLoc;
	var currentSchedule = getSchedule(d.getDay());
	var nextDay = false;
	if(myArrayLoc > currentSchedule.length || d.getDay() === 0){
		if(d.getDay() + 1 == 7){
			return;
		}
		currentSchedule = getSchedule(d.getDay() + 1);
		myArrayLoc = -1;
		nextDay = true;
	}
	var openingMessage = "";
	if(nextDay){
		openingMessage = "Here's a preview of your schedule tomorrow:";
	} else if(currentArrayLoc > currentSchedule.length / 2){
		openingMessage = "Here's what the rest of your day looks like:";
	} else {
		openingMessage = "Here's your schedule for today:"
	}
	
	document.getElementById("opening-message").innerHTML = openingMessage;
	
	removeElement("schedule-preview");
	var widget = document.getElementById("preview-table");
	var tbl = document.createElement('table');
	tbl.style.width = '100%';
	tbl.setAttribute("align", "center");
	tbl.setAttribute("id","schedule-preview")
	var tbdy = document.createElement('tbody');
	var tr = document.createElement('tr');
	tr.style.textDecoration = "underline";
	for (var j = 0; j < 2; j++) {
		var th = document.createElement("th");
		th.setAttribute("id","t"+j)
		th.style.fontWeight = "600";
		if (j === 0) {th.innerHTML= "Time Till";} else {th.innerHTML= "Event";}
		tr.appendChild(th);
	}
	tbdy.appendChild(tr);
	
	for(var i = myArrayLoc + 1; i < currentSchedule.length - 2; i++) {
		var currentPeriod = currentSchedule[i];
		if(!(currentPeriod.title.includes("→") || currentPeriod.title.includes("Bell"))){
			tr = document.createElement('tr');
			for (j = 0; j < 2; j++) {
				var td = document.createElement('td');
				td.setAttribute("id","td"+i+j);
				td.setAttribute("align","center");
				
				if(j == 0){
					if (nextDay){
						currentPeriod.startRaw = currentPeriod.startRaw + (3600 * 24);
					}
					var minsToClass = toMins(currentPeriod.startRaw - parseRaw());
					if (minsToClass < 10) {
						minsToClass = "0" + minsToClass; 
						if (minsToClass < 1) { 
							minsToClass = "01";
						}
					} 
					var hrsToClass = toHrs(currentPeriod.startRaw- parseRaw());
					if (hrsToClass < 1){
						hrsToClass = "0";
					}
					td.innerHTML = "T- " + hrsToClass + ":" + minsToClass;
				} else {
					td.innerHTML = currentPeriod.title;
				}
				tr.appendChild(td);
			}
			tbdy.appendChild(tr);
		}
    }
	tbl.appendChild(tbdy);
	widget.appendChild(tbl);
}

function removeElement(elementId) {
    // Removes an element from the document
    var element = document.getElementById(elementId);
	if (element){
		element.parentNode.removeChild(element);
	}
}

function updateMainMessage()
{
	if(d.getMonth() === 8 && d.getDay() < 2){
		mainMessage = "Welcome Back!";
		if(getCookie("name") != ""){
			mainMessage = "Welcome Back " + getCookie("name") +"!";
		}
	}else{
		if(d.getHours() <= 5 && d.getHours() > 20){
			mainMessage = "Goodnight...";
		}else if (d.getHours() < 12 && d.getHours() >= 5){
			mainMessage = "Good Morning!";
			if(getCookie("name") != ""){
				mainMessage = "Good Morning " + getCookie("name") +"!";
			}
		}else if (d.getHours() < 17 && d.getHours() >= 12){
			mainMessage = "Good Afternoon!";
			if(getCookie("name") != ""){
				mainMessage = "Good Afternoon " + getCookie("name") +"!";
			}
		}else{
			mainMessage = "Good Evening!";
			if(getCookie("name") != ""){
				mainMessage = "Good Evening " + getCookie("name") +"!";
			}
		}
	}
	
	if (!(mainMessage === "")) {
		document.getElementById("message").innerHTML = mainMessage;
		document.getElementById("message-widget").style.display = "block";
    }
}

setInterval(loadTime, 1000);
setInterval(loadDate, 1000);
setInterval(updateD, 1000);
setInterval(update, 1000);
setInterval(updateMainMessage, 1000);
