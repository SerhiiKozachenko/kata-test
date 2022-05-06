git clone --bare . turnin.git
Compress-Archive -DestinationPath turnin.git.zip -Path turnin.git
Remove-Item -Recurse -Path turnin.git
