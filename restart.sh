#!/bin/bash

screen -X -S exhibit quit
pkill chromium
./run_exhibit.sh
