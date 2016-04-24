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

mkdir -p /home/pi/.config/pcmanfm/LXDE-pi/
cat > /home/pi/.config/pcmanfm/LXDE-pi/desktop-items-0.conf <<- EOM
[*]
wallpaper_mode=center
wallpaper_common=1
wallpaper=${PWD}/static/img/background.png
desktop_bg=#000000
desktop_fg=#000000
desktop_shadow=#d6d3de
desktop_font=Roboto Light 12
show_wm_menu=0
sort=mtime;ascending;
show_documents=0
show_trash=0
show_mounts=0
EOM
chown -R pi:pi /home/pi/.config/

config=/home/pi/.config/lxpanel/LXDE-pi/panels/panel
sed -i 's/autohide=0/autohide=1/' $config
sed -i 's/heightwhenhidden=2/heightwhenhidden=0/' $config

mkdir -p /home/pi/.config/autostart
if [ ! -e ~pi/.config/autostart/exhibit.desktop ]; then
  cat > ~pi/.config/autostart/exhibit.desktop <<- EOM
[Desktop Entry] 
Type=Application
Exec=$PWD/run_exhibit.sh
EOM
fi
chown -R pi:pi /home/pi/.config/autostart

