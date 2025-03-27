#!/bin/env bash

sudo apt install pip3 pipx -y
pipx install objection
pip3 install -U git+https://github.com/AbhiTheModder/pyxamstore
curl -fsSL https://bun.sh/install | bash

mkdir ~/.xamarin-reverse-tool/xamarin-reverse-tool
cd ~/.xamarin-reverse-tool/xamarin-reverse-tool
git clone https://github.com/shpaw415/xamarin-reverse-tool.git
bun i


echo Add 
echo $HOME/.xamarin-reverse-tool/xamarin-reverse-tool
echo to your PATH