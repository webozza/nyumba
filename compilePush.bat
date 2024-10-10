@echo off

echo Clearing cache
del .\build\*.* /Q

echo Change to production config
cmd /C ren .\src\lib\config.ts config.dev
cmd /C ren .\src\lib\config.prod config.ts

echo Compiling
cmd /C yarn build

echo Change back to development config
cmd /C ren .\src\lib\config.ts config.prod
cmd /C ren .\src\lib\config.dev config.ts

echo Copying to server
scp -P 1026 -r ./build/* gasadmin@154.0.161.197:/var/www/nyumba.glovebox.co.za/html 