#!/bin/bash

port=7070

# Kill the existing python process
pid=$(lsof -t -i:$port)
if [ -z $pid ]
   then
      echo "The game was not running."
   else
      kill -9 $pid
fi

# Start it
cd /home/pi/qself/pr0n
gulp &> /var/log/game.log &

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
