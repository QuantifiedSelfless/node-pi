#!/bin/bash

exhibit=$1
giturl=$( cat ./exhibit/$exhibit/exhibit.json | jq '.git' )
git clone $giturl ~/exhibit
