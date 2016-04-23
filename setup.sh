#!/bin/bash

for i in $( ls scripts/ ); do
    echo "Running setup: $i"
    ./scripts/$i
done
