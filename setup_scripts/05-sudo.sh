#!/bin/bash

if ! grep -E "^pi" /etc/sudoers; then
  echo "pi ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers
fi
