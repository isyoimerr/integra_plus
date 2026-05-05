# INTEGRA+ launcher for Windows PowerShell.
# Usage: .\start.ps1

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting INTEGRA+..."

$xamppDir = "C:\xampp"
$xamppStart = Join-Path $xamppDir "xampp_start.exe"
$mysqlStart = Join-Path $xamppDir "mysql_start.bat"
$apacheStart = Join-Path $xamppDir "apache_start.bat"

if (Test-Path $xamppStart) {
  Write-Host "Starting XAMPP from C:\xampp..."
  Start-Process -FilePath $xamppStart -WindowStyle Hidden
} elseif (Test-Path $mysqlStart) {
  Write-Host "Starting MySQL from C:\xampp..."
  Start-Process -FilePath $mysqlStart -WorkingDirectory $xamppDir -WindowStyle Hidden

  if (Test-Path $apacheStart) {
    Write-Host "Starting Apache from C:\xampp..."
    Start-Process -FilePath $apacheStart -WorkingDirectory $xamppDir -WindowStyle Hidden
  }
} else {
  Write-Host "XAMPP was not found in C:\xampp. Start MySQL manually from XAMPP Control Panel."
}

Write-Host "Waiting for services..."
Start-Sleep -Seconds 3

Write-Host "Starting backend and frontend..."
Set-Location $RootDir
npm run dev
