#!/usr/bin/env node
/* Basic configuration and testing sucessful
   Uses i2c lib directly. node install i2c : from https://github.com/kelly/node-i2c

   MAX3700AAZ - 36SSOP 
   28Ports P4-P31
   P31 can be configured as ACT HIGH INT by setting to be o/p
*/
var b = require('bonescript');


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


var i2c = require('i2c');
var address = 0x45;

var wire = new i2c(address, {device: '/dev/i2c-2'}); // MAX3700aax  i2c address, debug provides REPL interface
var station_data = [0x0,0x0,0x0,0x0];

//wire.scan(function(err, data) {
  // result contains an array of addresses
//});
console.log("Starting:");
/* max.getModestation-max7300(function(data) //CMD 94
 {
     console.log("mode="+data);
 });*/
 /* Setup Ports Address 0x09->0x0F to input with pullup*/
 var pins_config_states =[0xff,0xff,0xff,0xff,0xff,0xff,0xff];
 var pins_config_cmd=0x09;
 wire.writeBytes(pins_config_cmd, pins_config_states, function(err) {
    if(err) { console.log("writeBytes cPins Err:"+err);}
 });/* */
var dev_config_cmd=0x04;
var dev_config_state=[0x01,0x00];
wire.writeBytes(dev_config_cmd, dev_config_state, function(err) {
    if(err) { console.log("writeBytes cfg Err:"+err);}
 });/* */
 
 //var pins_read_cmd=0x44; 

// Polling interval
setInterval(getStationHw, 2000);


// read the station inputs
function getStationHw() {
   readPort(0);
   readPort(1);
   readPort(2);
   //console.log("getStationHw:"+station_data.toString(16));
   console.log("getStationHw:"+station_data);
}

function readPort(port_num) {
 /* 0x09 7bytes reads Config
  * 0x24:P4 ...0x39:P25
  * 0 -> P04-11  - 8bits
  * 1 -> P12-19  - 8bits
  * 2 -> P20-27  - 8bits  
  * 3 ?? P28-31    4bits
 */
   var cmd=0;
   switch(port_num)
   {
      case 0:
         cmd = 0x44;
         break;
      case 1:
         cmd = 0x4C;
         break;
      case 2:
         cmd = 0x54;
         break;
      default:
	     port_num=3;
      case 3:
         cmd = 0x5C;
         break;
    }
 
  wire.readBytes(cmd, 1, function(err, data) {

   if (!err) {
      var data_num = 0;
      for (var i = 0; i<data.length; i++) {
      	data_num = parseInt(data[i]);
        if (isNaN(data_num)) 
           {
           data_num = 0;
           console.log("readPt ill Num");
           }
        }
       station_data[port_num]=data_num;
       //console.log("readPt="+station_data[port_num].toString(16));
       //console.log("readPt["+port_num+"]="+data_num.toString(16));
     } else {
       console.log("readBytes err");     	
     }
   });
   /*------------------------
      this.wire.readBytes(cmd,1, function(err,data)
    {
        var state = 0;
        for (var i = 0; i<data.length; i++) {
            if (isNaN(parseInt(data[i]))) 
            {
                data[i] = 0;
            }
        }

        state = data[0] & Math.pow(2,int_pin);
        if(state !== 0)
        {
            data[0] = true;
        }
        else
        {
            data[0] = false;
        }
        callback(data[0]);
    });
   ------------------------*/
}
