#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 [exhibit]"
  exit
fi

echo "Setting up exhibit: $1"
for i in $( ls setup_scripts/ ); do
    echo "Running setup: $i"
    sudo bash ./setup_scripts/$i $1
done
