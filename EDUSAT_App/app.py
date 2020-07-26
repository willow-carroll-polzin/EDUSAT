import sys
import serial
import time
import csv
import serial.tools.list_ports

def Timestamp():
    date_now = time.strftime('%d-%m-%y')
    time_now = time.strftime('_%H-%M-%S')
    return [date_now,time_now]
def csvNamer():
    dt = Timestamp()
    fileName = 'EDUSAT_RESULTS_' + dt[0] + dt[1] + '.csv'
    #fileName = 'test.csv'
    return fileName
def Reader():
    global ser
    if (ser.isOpen()):
        try:                    
            x = ser.readline().decode()
            x = (x)
            return x
        except:
            return "Unable to print\n"
    else: 
        return "Cannot open serial port\n"

#Figure out which port has the arduino on it
ports=list(serial.tools.list_ports.comports())
for p in ports:
    print p
    if "USB" in p.description:
        comPort=p.device
        print comPort

#Open serial port to read from Arduino serial monitor    
arduino = serial.Serial(comPort, 9600, timeout=.1) 
time.sleep(1) #give the connection a second to settle
#Open file 
name = csvNamer()
count = 0
with open(name, 'w') as dataFile:
    writer = csv.writer(dataFile) #Open writer to write to csv
    while True:
        data = arduino.readline()[:-2].decode() #[:~2] removes newline chars
        #If current data not zero, print and write it
        if data:
            print(data)    
            count = count + 1
            writer.writerow([count,data])
            dataFile.flush()
            #time.sleep(5)
