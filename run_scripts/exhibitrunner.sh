#!/bin/bash

exhibit=$( hostname )
ln -sf $PWD/exhibit/${exhibit}/exhibit.json \
       $PWD/static/data/exhibit.json

sudo node exhibitRunner.js
