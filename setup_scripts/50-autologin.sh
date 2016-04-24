#!/bin/bash

# ripped out of /usr/bin/raspi-config
# ----
if command -v systemctl > /dev/null && systemctl | grep -q '\-\.mount'; then
    SYSTEMD=1
elif [ -f /etc/init.d/cron ] && [ ! -h /etc/init.d/cron ]; then
    SYSTEMD=0
fi

if [ $SYSTEMD -eq 1 ]; then
    systemctl set-default graphical.target
    ln -fs /etc/systemd/system/autologin@.service /etc/systemd/system/getty.target.wants/getty@tty1.service
else
    update-rc.d lightdm enable 2
fi
sed /etc/lightdm/lightdm.conf -i -e "s/^#autologin-user=.*/autologin-user=pi/"
# ----

mkdir -p /usr/share/backgrounds/
cp static/img/background.png /usr/share/backgrounds/background.jpg
cat > /usr/share/gnome-background-properties/debian.xml <<- EOM
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE wallpapers SYSTEM "gnome-wp-list.dtd">
<wallpapers>
   <wallpaper>
    <name>Custom_Back1</name>
    <filename>/usr/share/backgrounds/background.jpg</filename>
    <options>center</options>
    <pcolor>#000000</pcolor>
    <scolor>#000000</scolor>
    <shade_type>solid</shade_type>
   </wallpaper>
</wallpapers>
EOM

config=/home/pi/.config/lxpanel/LXDE-pi/panels/panel
sed -i 's/autohide=0/autohide=1/' $config
sed -i 's/heightwhenhidden=2/heightwhenhidden=0/' $config

cat >> /etc/X11/xinit/xinitrc <<- EOM
xset -dpms
xset s off
xset s noblank
EOM
