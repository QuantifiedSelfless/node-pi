#!/bin/bash

disable_keys=(
    '67' '68' '69' '70' '71' '72' '73' '74' '75' '76' '95' '96' # F keys
    '64' '108' '205' '133' '134' '206' '37' '105' '64' '108' '204' # meta chars
    '180' '163' '223' '121' '198' '148' # media keys
    '107' '78' '127' '118' '110' '112' '119' '115' '117' '77' # middle board keys
)
cat > /home/pi/.xmodmap <<- EOM
clear Control
clear Mod1
clear Mod2
clear Mod3
clear Mod4
clear Mod5
EOM
for key in ${disable_keys[@]}; do
    echo "keycode $key = 0x0000" >> /home/pi/.xmodmap
done

cat > ~pi/.config/autostart/keyboard.desktop <<- EOM
[Desktop Entry] 
Name=Keyboard
Type=Application
Exec=/usr/bin/xmodmap ~/.xmodmap
EOM
