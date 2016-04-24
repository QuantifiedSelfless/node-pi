#!/bin/bash

exhibit=$( hostname )
ln -sf $PWD/exhibit/${exhibit}/exhibit.json \
       $PWD/static/data/exhibit.json

node exhibitRunner.js
