#!/bin/bash
echo -n "Enter new hostname: "
read hostname
echo $hostname > /proc/sys/kernel/hostname
sed -i 's/127.0.1.1.*/127.0.1.1\t'"$hostname"'/g' /etc/hosts
echo $hostname > /etc/hostname
service hostname restart
apt-get install avahi-daemon
insserv avahi-daemon
service avahi-daemon restart
