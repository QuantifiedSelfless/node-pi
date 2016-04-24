#!/bin/bash

exhibit=$1
giturl=$( cat ./exhibit/$exhibit/exhibit.json | jq '.git' | xargs echo )
sudo -u pi git clone $giturl ~pi/exhibit
