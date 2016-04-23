#!/bin/bash

screen -X -S exhibit kill
./restart.sh

# Restart the browser
export DISPLAY=:0
pid=$(ps aux | grep chromium-browser | grep -v "grep" | cut -d " " -f9)
chromium-browser --kiosk http://localhost:8000/ &>/var/log/chrome.log &
if [[ -z $pid ]]
   then
      echo "Chrome wasn't running"
   else
      kill $pid
fi
echo DONE
