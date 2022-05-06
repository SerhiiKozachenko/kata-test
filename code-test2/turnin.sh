#!/bin/sh

git clone --bare . turnin.git
zip -r turnin.git.zip turnin.git
rm -rf turnin.git
