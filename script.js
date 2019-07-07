/*
Controller for clock/time webapp
Jiahua Chen, based off Eric Li's original design
Last updated 6 July 2019
*/

// Gets the current date and time
var d = new Date();
// var d = new Date(2019,2,5,15,13,03,0);
// console.log(" *** d.getDate() " + d.getDate());
// console.log(" *** d.getMonth() " + d.getMonth());
// console.log(" *** dayType noClassSats" + i);

// Updates the date and time
function updateD() {
    d = new Date();
}

var showTime = true;
var descText;
var weekendText = "";

// Gets the classification of the date, and returns 0 if it is a normal day. Also contains dictionaries for special days.
// Defines the special days
var onbreak = true;
var specialDays = [new CalDay(3, 8), new CalDay(4, 25)]; // <- For special event days
var noClassSats = [new CalDay(4, 20), new CalDay(5, 4), new CalDay(5, 18)]; // <- For days without Saturday classes
var noClassDays = [new CalDay(4, 22), new CalDay(5, 18), new CalDay(5, 27), new CalDay(6, 1)]; // <- For days without classes, or breaks
var holidayDays = []; // <- For holidays
function dayType() {
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
    d = new Date();
    // Adjusts into AM and PM time
    var hr = ((d.getHours() + 11) % 12 + 1);
    var sufx = (d.getHours() >= 12) ? 'PM' : 'AM';

    // Outputs to HTML
    document.getElementById("clock").innerHTML = hr + ":" + ("0" + d.getMinutes()).slice(-2) + " " + sufx;
}

function loadDate() {
    // Dictionary for text-based date
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
        var currentSchedule = getSchedule();
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
                if (currentSchedule[i].title === "Passing Period") {
                    normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 1].title, currentSchedule[i + 1].startRaw - parseRaw());
                } else {
                    normalDay(currentSchedule[i].title, currentSchedule[i].endRaw - parseRaw(), currentSchedule[i + 2].title, currentSchedule[i + 2].startRaw - parseRaw());
                }
            }
            if (parseRaw() > currentSchedule[currentSchedule.length - 1].endRaw) {
                showTime = true;
                document.getElementById("class-info").innerHTML = "";
                document.getElementById("schedule-info").innerHTML = descText + "<b> ⋅ Have a nice day!</b>";
            }
        }
    } else {
    }
    if (showTime) {
        document.getElementById("hrs").style.display = "block";
        rawTime = parseRaw();
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
function getSchedule() {
    // console.log(" *** d.getDate() " + d.getDay());
    var weekday = d.getDay();

    // Defines the currentSchedule array
    var currentSchedule = [];

    // Assigns class schedules for weekday scenarios
    if (weekday === 1 || weekday === 4) {
        currentSchedule[0] = new Period("Period 1", 8, 30, 9, 15);
        currentSchedule[1] = new Period("→ Period 2", 9, 15, 9, 20);
        currentSchedule[2] = new Period("Period 2", 9, 20, 10, 5);
        currentSchedule[3] = new Period("Passing Period", 10, 5, 10, 10);
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
        currentSchedule[3] = new Period("Passing Period", 9, 55, 10, 0);
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
    return currentSchedule;
}

function specialSchedule() // <- What to print during special schedules
{
    document.getElementById("class-info").innerHTML = "<i>Special Schedule</i>";
    document.getElementById("schedule-info").innerHTML = "Please consult your planner for details.";
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
    document.getElementById("class-info").innerHTML = "→ " + title;
    document.getElementById("schedule-info").innerHTML = descText + weekendText;
    printTime(time);
}

function thisWeekend() {
    for (d = 0; d < 7; d++) {
        var result = new Date();
        result.setDate(result.getDate() + d);
        for (i = 0; i < noClassSats.length; i++) {
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

// Converts raw time format to a parsed time string
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

window.addEventListener('load', onLoad);

function onLoad() {
    d = new Date();
    loadTime();
    loadDate();
    update();
    weekendText = thisWeekend();
}

setInterval(loadTime, 1000);
setInterval(loadDate, 1000);
setInterval(updateD, 1000);
setInterval(update, 1000);
