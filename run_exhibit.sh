#!/bin/bash

# care of http://stackoverflow.com/a/246128/540741
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
cd $DIR

screen -d -m -S exhibit
for script in $( ls run_scripts ); do
  echo "Starting: ${script}"
  screen -S exhibit -X screen bash ./run_scripts/$script
done;

export DISPLAY=:0.0
pkill chromium
sudo -u pi bash -c "
  xset -dpms
  xset s off
  xset s noblank
  chromium-browser --incognito --kiosk http://localhost:8000/ &> ${PWD}/chrome.log &
"
