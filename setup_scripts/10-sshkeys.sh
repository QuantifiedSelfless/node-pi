#!/bin/bash

mkdir -p /home/pi/.ssh/
cat > /home/pi/.ssh/authorized_keys <<- EOM
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDBpGdEVTk7MQ9fwQTT9LMSPCjDwsrO4eV/3ozcOe0trIm3tstg9GYqLDHCUjAeOr1kA11K0wPkasllWbXzi5Yo1bWs8sJaWwFc8n5EP3B/jH92Wkj6qfbn67dvm/ILVpG84U9ikzUWktZ23J+zBK2KSeY7CQ/psFyoK+5Iuc8OCVoGsxlbQNW9rh7bZoQw0V6fy0bZsEfLm/IjOZ9b7Xpg7IJfFaMzvlqM6q9E00VA7fIfzB3hCzwR3nc5PeUHHrhP3c+THDwDIMqH5A+/DIZGAJJeGJ5T/aWYqG5IJ31EJJwwrJSmhqeQ/BF6Iif/HescbuMBRWUI6efkK9viZMbN doorsofskirpan@gmail.com
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC/8TxJIysSWG0/5wIFteSXTvVrEU30Ntt47OpfzjWHlIVDAM3eccDXP6Yb5jAk6NURtBnAFa+EWYy73IMDNm27dagAJL4+bQEzQ8Ryt/Mi2FweIA1iEgm4CvF4sUwGAup7+8XY3x/ascHNsxEaptfDeuNFz6DtN8pnF7n+9A/1YRL5lfQGd2Yy+d250/gNOzXd32ThA4MOz2WghPbOPuC5GVhLzxB30nlVoahYWXXOd3ATlU8EpkV1rndPlQmiyizysJJcSwtodq5/h6hzi3//zse5IKP/83Ki3kVjggWpv6sOkOrlYfDc2W7S9swaX0/xRHQDWzfvgdxxm/rD5l7h peyman@rl1gw1-131-14-dhcp.int.colorado.edu
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDDS5bcfpJOcswH5Ky0KcsFW4rLf6o1hNMFS9XY+qD2dWIBduOEjzqzEylpjDUMfN6bWiRBClWVKibJJK0lxZNi8oJzUCGZfsPiEPWMKJFdyHsZjojTXScC+vFG35nRldovkdLc2mwAspBi4BEOEkTTXC77YLoTMscdJXHwJa66wabZbD9H1Ov2FNx45mkNBE25m33RLUbRfL/Fdu2cpcBAJMOe/245vfXC1jOpHl1/6xZ23WMssf5rKmBVWqLsSmFDIougHctRtsp84+fqYQgY19vhGw+b5GmGO9eifZSyMQDti5VBIl9WpluBZwKy/cjMihgWB1qeBYzpvKupIYKl micha@electron
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDrEuoS6fvSM4p5gW7hZAbC5mXcSMMQTrHiy8LEO0SdqhQiGDVWOpRQUMnF5AYd+rI2htbe6fwaSdUbybCjsVwTkQk2pbH4hFjkeLkp9s3Zg+1D3OtgkNwP54xbQJk5+Uyfzh/VJRdHb+Ib5rRo4ukN6hB41DMKyhTv9gsYw1wrZBrppa+mvZMrw31ap9fkuGPJVkwW0yd9vjkxKXEg+A727ifcI2rW2Wipjn0z+BVnRs65ffMpDzGM2WW26dVGGeuGh9GHHVmlng577wqbdUpdMZzv/3Ri02BrzUtRiSnA1V+qz4QMhLrLvzzjiP8aEq/n15SBX5XpfyN2WMJnGp6f pi@bridge
EOM

chown -R pi:pi /home/pi/.ssh
chmod 700 /home/pi/.ssh
chmod 600 /home/pi/.ssh/authorized_keys
