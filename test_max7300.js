#!/usr/bin/env node
var b = require('bonescript');
var max7300 = require('../../node_modules/max7300aax/i2c-max7300');
//var max7300 = require('i2c-max7300')
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
var max = new max7300('/dev/i2c-2', 0x45);


console.log("Starting:");
 max.getModeMax7300(function(data) //CMD 94
 {
     console.log(data);
 });
 /*TODO: write 0xff to Add 0x09->0x0F to set all ports to input with pullup
 Read 0x20 to 0x5F
 */
// Polling interval
setInterval(getStationHw, 2000);
function readStations() {
 /* 0x09 7 reads Config
  * 0x24:P4 ...0x39:P25
 */
 max.wire.readBytes(0x24,2,function(err,data)  // readBytes(cmd,1, function(err,data)
    {
       console.log(data);
    }

)}
// read the station inputs
function getStationHw() {
 console.log("getStationHw:");
 //readStations();

}
