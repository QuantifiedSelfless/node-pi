#!/bin/bash
hostname=$1
echo $hostname > /proc/sys/kernel/hostname
sed -i 's/127.0.1.1.*/127.0.1.1\t'"$hostname"'/g' /etc/hosts
echo $hostname > /etc/hostname
service hostname restart

apt-get install -y avahi-daemon avahi-dnsconfd avahi-discover avahi-utils libnss-mdns
insserv avahi-daemon
insserv avahi-dnsconfd
service avahi-daemon restart
service avahi-dnsconfd restart
