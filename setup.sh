#!/bin/bash
echo "Installing SSH Keys..."
./install_ssh_keys.sh

echo "Setting up network and mDNS: "
sudo ./setup_network.sh
