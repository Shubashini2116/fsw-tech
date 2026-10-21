@echo off
title TaskFlow GitHub One-Click Push
echo ========================================================
echo Connecting to your GitHub account...
echo A browser window will open. Click 'Continue' and 'Authorize'.
echo ========================================================
set "GH=%LOCALAPPDATA%\Programs\gh\bin\gh.exe"
set "GIT=%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"

"%GH%" auth login -h github.com -p https -w

echo.
echo ========================================================
echo Setting up Git credentials...
echo ========================================================
"%GH%" auth setup-git

echo.
echo ========================================================
echo Pushing TaskFlow code to https://github.com/Shubashini2116/fsw-tech...
echo ========================================================
cd /d "c:\Users\win11\Downloads\resq-command"
"%GIT%" push -u origin main --force

echo.
echo ========================================================
echo SUCCESS! Your code is now live on GitHub:
echo https://github.com/Shubashini2116/fsw-tech
echo ========================================================
pause
