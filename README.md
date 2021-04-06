# 🕒 CClock · ![version](https://img.shields.io/badge/version-2.1-yellowgreen.svg)

**CClock** stands for *countdown clock*, or *class clock*. It is meant to count down the time left in each class block, and is also a reminder for the time remaining until the start of the next class block. CClock is fully customizable, adaptable, and works on all devices. Additionally, the simplest version of CClock (here) is fully static and only runs clientside. This means that CClock can be run from Github Pages or another static site host. 

![Screenshot of CClock](https://raw.githubusercontent.com/jchen/cclock/master/assets/screenshot.jpg)

## Table of Contents
  * [Installation](#installation)
  * [Appearance](#appearance)
    + [Fonts](#fonts)
    + [Background](#background)
  * [Customization](#customization)
    + [Add your own schedule](#add-your-own-schedule)
    + [Special schedules](#special-schedules)
    + [Widgets](#widgets)
    + [Messages & Quotes](#messages--quotes)
  * [To-Do](#to-do)
  * [Thanks](#thanks)

## Installation
CClock can be downloaded through Github: 
```
git clone https://github.com/jiahuac/cclock
```

`index.html` is the default page for CClock. 

## Appearance

The style is located in the `style.css` file. 

### Fonts
```
font-family: 'Open Sans', sans-serif;
```
The current font family is Google's Open Sans. When changing the font, remember to change the font as defined in the body, and link the appropriate font stylesheet into the head of `index.html`. All webfonts are supported. 

### Background
The following code controls the background: change the color values or numbers to adjust the background of the clock. 
```css
/* Animated gradient background */
background: linear-gradient(-30deg, #111E6C, #0E4D92, #0F52BA, #003152);
background-size: 1000% 1000%;
-webkit-animation: Gradient 15s ease infinite;
-moz-animation: Gradient 15s ease infinite;
animation: Gradient 15s ease infinite;
```

## Customization

### Add your own schedule
`script.js` is the controller for the clock on the page. It's simple but naïve –– the static page requires static changes to the code. For now, this means that you need to go into the actual functions to change the schedule, and the schedule unfortunately is not dynamically loading. 

`getSchedule()` gets the schedules of the day and outputs the correct block/period. `weekday` starts on Sunday (0), thus making Monday 1, and so on. You want to define and fill the array currentSchedule to indicate the period the specific weekday is following: 
```javascript
currentSchedule[0] = new Period("Period 1", 8, 30, 9, 15);
```
Where `new Period("Period 1", 8, 30, 9, 15)` means that the first period of the day (in `currentSchedule[0]`) is called "Period 1", and it starts at 8:30 AM and ends at 9:15 AM. The rest of the periods, and the rest of the days are defined similarly. 

### Special schedules
At the start of the document, there are definitions for special days. On some occasions, events or special schedules might disrupt the normal schedule. This is where it should be defined and noted. Note that `new CalDay(3, 8)` means 8th of March. 
```javascript
// Defines the special days
var onbreak = true;
var specialDays = [new CalDay(3, 8), new CalDay(4, 25)]; // <- For special event days
var noClassSats = [new CalDay(4, 20), new CalDay(5, 4), new CalDay(5, 18)]; // <- For days without Saturday classes
var noClassDays = [new CalDay(4, 22), new CalDay(5, 18), new CalDay(5, 27), new CalDay(6, 1)]; // <- For days without classes, or breaks
var holidayDays = []; // <- For holidays
```
`update()` calls on `dayType()` to return the correct number corresponding to the type of day, and then does special functions accordingly. 

For example, `dayType()` returns 1 if it is a 'Special Day', and `update()` is defined so that...
```javascript
   ...
    if (type === 1) {
        specialSchedule();
    }
   ...
```
if `dayType()` = 1, then it invokes `specialSchedule();`, which is defined below to print a special message when there is a special schedule. This is expendable, you may assign any type of special date a 'type number', and have it perform a corresponding action if/when it is a day of that type. 

### Widgets

You can add your own widgets to a scrollable widget area on the top right (on a phone, it extends to fit the whole page). For example, here is the quotes widget: 
```html
<div class="widget" id="quote-widget" style="display: none;">
    <p id="quote"></p>
    <p align="right" id="speaker" style="font-weight: 700;"></p>
</div>
```
You may add any widgets here, with class `widget`. The style can be set to `display: none;` until whatever JS code loads the widget content in, and then you can dynamically show the widget through whatever code's loading the widget content. This can be backend or frontent code if you wish, and you can really do anything with the widgets (load menus, other schedules, etc). 

### Messages & Quotes

A widget is defined to print a message to the widget area. The message is loaded in the `message.js` file: 

```javascript
var message = ["Have a great summer! "]; // <- Message goes here!
```

You can change this message to whatever you want, and it will load the first message in the `message` array into the message widget block. 

The clock will also display a random inspirational quote whenever you load it, loaded into the `quotes` array in `messages.js`. You can customize the 'speaker' and 'quote' of all these quotes (or do something else with it). 

## To-Do
- [X] Widgets. 
- [ ] Offline mode for mobile. (PWA Support and UpUp)
- [ ] Dynamic schedule. 
- [ ] Dynamic plugins. 

## Thanks
The design of version 2 was inspired by [Decount](https://decount.co/) (and this design was reimplemented into Decount), and the original source code was adapted from [Eric Li's Network Clock](https://github.com/eli8527/Network-Clock). 

CClock © 2019, Jiahua Chen. Released under the [MIT License](https://mit-license.org/).
