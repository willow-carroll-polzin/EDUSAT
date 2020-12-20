ECHO Starting EDUSAT Monitoring system...

cd ./EDUSAT_APP/webpage

start http://localhost:8085


start /b yarn install
start "SERVER PAGE" yarn serve

cd ../socket_server 

start /b yarn build
start /b yarn start

cd ../serial

start /b yarn build
start /b yarn start




