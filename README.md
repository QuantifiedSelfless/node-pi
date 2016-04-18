# node-pi

## Running an exhibit
1. Make sure you have a file in `static/data/exhibit.json` that describes your exhibit. If you do not have that file use `static/data/template.json` to create your file. You'll need to specify a title, a description, an explanation for how many players, an interger for max number of players, the backend url for the processor you want the exhibit to talk to, a baseurl for where you anticipate on localhost the exhibit will be running, and a desired delay for how long you want the exhibit to wait before it loads after a user scans in.
2. Run `sudo node exhibitRunner.js` to make sure all the listeners are ready to pass along rfid scans and button presses`
3. Serve the index file using something like `python -m SimpleHTTPServer 8000`

## Special cases
If you have an exhibit that requires special styling, place your desired files in `src/` (like the romance one) and then make a gulp task in `gulpfile.js` that moves your specific styles into the proper locations in `static/`

## Raspberry Pi Network Configuration

####Steps:
1. Setup the hostname and mdns using ```sudo ./setup_network.sh```
2. Install the ssh keys using ```./install_ssh_keys.sh``` 

OR

if it's the first time you're setting up the pi just run `sudo ./setup.sh`
