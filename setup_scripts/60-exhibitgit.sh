#!/bin/bash

exhibit=$1
giturl=$( cat ./exhibit/$exhibit/exhibit.json | jq '.git' | xargs echo )
git clone $giturl ~/exhibit
