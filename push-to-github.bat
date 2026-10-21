@echo off
title Push TaskFlow to GitHub
echo ===================================================
echo Pushing TaskFlow project to GitHub...
echo ===================================================
cd /d "c:\Users\win11\Downloads\resq-command"
"%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" push -u origin main --force
echo.
echo ===================================================
echo PUSH COMPLETE! Refresh your GitHub page:
echo https://github.com/Shubashini2116/fsw-tech
echo ===================================================
pause
