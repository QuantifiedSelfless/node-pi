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
screen -S exhibit -p 0 -X exhibit bash -c "cd ~/exhibit/ ; ./run.sh"
i=1
for script in ls $( ls run_scripts ); do
    screen -S mysession -X $script $i
    screen -S mysession -p $i -X bash ./run_scripts/$script
    i=$(( $i + 1 ))
done;

screen -S mysession -X screen 2
screen -S mysession -p 1 -X login python3 -m http.server 8000

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
