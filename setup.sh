#!/bin/bash

echo "Setting up exhibit: $1"

for i in $( ls scripts/ ); do
    echo "Running setup: $i"
    ./scripts/$i $1
done
