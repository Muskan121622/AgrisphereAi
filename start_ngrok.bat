@echo off
echo ==========================================
echo AgriSphere WhatsApp Bot - Ngrok Tunnel
echo ==========================================
echo.
echo Make sure your Flask server is running on port 5000.
echo.
echo 1. If you haven't authenticated ngrok, run: ngrok config add-authtoken YOUR_TOKEN
echo 2. Starting tunnel...
echo.
ngrok http 5000
echo.
pause
