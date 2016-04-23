#!/bin/bash

echo "Setting up exhibit: $1"

for i in $( ls setup_scripts/ ); do
    echo "Running setup: $i"
    ./setup_scripts/$i $1
done
