#!/bin/bash

cat > /home/pi/.xmodmap <<- EOM
keycode  67 = 0x0000
! F1
keycode  68 = 0x0000
! F2
keycode  69 = 0x0000
! F3
keycode  70 = 0x0000
! F4
keycode  71 = 0x0000
! F5
keycode  72 = 0x0000
! F6
keycode  73 = 0x0000
! F7
keycode  74 = 0x0000
! F8
keycode  75 = 0x0000
! F9
keycode  76 = 0x0000
! F10
keycode  95 = 0x0000
! F11
keycode  96 = 0x0000
! F12
keycode  64 = 0x0000
! Alt_L Meta_L Alt_L Meta_L
keycode 108 = 0x0000
! Alt_R Meta_R Alt_R Meta_R
keycode 205 = 0x0000
! NoSymbol Meta_L NoSymbol Meta_L
keycode 133 = 0x0000
! Super_L NoSymbol Super_L
keycode 134 = 0x0000
! Super_R NoSymbol Super_R
keycode 206 = 0x0000
! NoSymbol Super_L NoSymbol Super_L
keycode  37 = 0x0000
! Control_L NoSymbol Control_L
keycode 105 = 0x0000
! Control_R NoSymbol Control_R
keycode  64 = 0x0000
! Alt_L Meta_L Alt_L Meta_L
keycode 108 = 0x0000
! Alt_R Meta_R Alt_R Meta_R
keycode 204 = 0x0000
! NoSymbol Alt_L NoSymbol Alt_L
EOM

cat > ~pi/.config/autostart/keyboard.desktop <<- EOM
[Desktop Entry] 
Name=Keyboard
Type=Application
Exec=/usr/bin/xmodmap ~/.xmodmap
EOM
