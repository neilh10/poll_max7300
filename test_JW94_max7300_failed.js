#!/usr/bin/env node
/* Exercise https://github.com/JW94/max7300  - however lib doesn't appear to be tested.

   MAX3700AAZ - 36SSOP 
   28Ports P4-P31
   P31 can be configured as ACT HIGH INT by setting to be o/p
     Transition detection applies to P24-P30 
*/
var b = require('bonescript');
//var max7300 = require('../../node_modules/max7300aax/i2c-max7300');
var station_max7300 = require('../max7300/i2c-max7300');
var station_data = [0x0,0x01,0x02];

/*Add Range 7bit is 0x40 to 0x4F
 * AD1 AD0     A3 2 1 0  Hex 
 * GND GND      0 0 0 0  40 
 * GND V+       0 0 0 1  41
 * GND SDA      0 0 1 0  42
 * GND SCL      0 0 1 1  43
 * V+ GND       0 1 0 0  44
 * V+ V+        0 1 0 1  45
 * ......       ...........

*/
var max = new station_max7300('/dev/i2c-2', 0x45);


console.log("Starting:");
/* max.getModestation-max7300(function(data) //CMD 94
 {
     console.log("mode="+data);
 });*/
  /*TODO: write 0xff to Add 0x09->0x0F to set all ports to input with pullup*/
  //config on nibble 0,4,8,12,16,20,24
 //max.setConfigPinMax7300(0,0xff, function(data) {console.log("Set0="+data); });
 //max.setConfigPinMax7300(4,0xff, function(data) {console.log("Set5="+data);});
 var pin_states =[0xff,0xff, 0xff,0xff, 0xff,0xff, 0xff];
 max.setPinConfig(0,pin_states,function(data) {console.log("cfgPin="+data); }); 
 max.setModeMax7300(0x01,function()  {
    //console.log("setModeMax");
  });
 /*
 Read 0x20 to 0x5F
 */
// Polling interval
setInterval(getStationHw, 2000);



// read the station inputs
function getStationHw() {
   /*global station_data[5] = [0x0,0x01,0x02,0x03,0x05]; */
   //console.log("getStationHw:");
   //readPort(0);
   readStations(0);
   readStations(8);
   readStations(16);
   console.log("getStationHw:"+station_data.toString(16));
}

function readPort(port_num) {
 /* 0x09 7bytes reads Config
  * 0x24:P4 ...0x39:P25
  * 00-07 -> P04-11  - 8bits
  * 08-15 -> P12-19  - 8bits
  * 16-24 -> P20-27  - 8bits  
  * 25+ error   (needs expanding if required)
 */
   max.rdPort(port_num,function(data) {
    // returns the states of pins
    //console.log(data);
    //var data_i = port_num>>3;
    station_data[port_num]=data;
    console.log("readPt="+data.toString(16));
   });
}
function readStations(pin_num) {
 /* 0x09 7bytes reads Config
  * 0x24:P4 ...0x39:P25
  * 00-07 -> P04-11  - 8bits
  * 08-15 -> P12-19  - 8bits
  * 16-24 -> P20-27  - 8bits  
  * 25+ error   (needs expanding if required)
 */
   max.getStateMax7300(pin_num,function(data) {
    // returns the states of pins
    //console.log(data);
    var data_i = pin_num>>3;
    station_data[data_i]=data;
    console.log("read"+pin_num+"/"+data_i+"="+data);
   });
}