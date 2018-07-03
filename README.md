# poll_max7300
A test interface for checking the MAX7300 serial expander

To use, on BBB   
/var/lib/cloud9/$ npm install max7300aax --save    #also intalls i2c   
or to enhance, fork  max7300aax    
/var/lib/cloud9/git$ git clone git@github.com:[uname]/max7300.git   
may require   
  /var/lib/cloud9/$ npm install i2c   
  
180628-2200 - Reading three 8 bit ports - but can't tell what they are reading.
180628-2100 Polling , salea logic anlayzer watching I2C
180628-1700 Have structure working, reading Configuration from device 
180628-1500 Have proto hw assembled.
