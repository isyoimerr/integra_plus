#!/usr/bin/env bash

# INTEGRA+ launcher: starts XAMPP/MySQL and then backend + frontend.
# Linux/macOS/Git Bash: ./start.sh

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting INTEGRA+..."

case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*)
    echo "Detected Windows/Git Bash."
    if [ -f "/c/xampp/xampp_start.exe" ]; then
      echo "Starting XAMPP from C:/xampp..."
      "/c/xampp/xampp_start.exe" >/dev/null 2>&1 &
    elif [ -f "/c/xampp/mysql_start.bat" ]; then
      echo "Starting MySQL from C:/xampp..."
      cmd.exe /c "C:\\xampp\\mysql_start.bat" >/dev/null 2>&1 &
      if [ -f "/c/xampp/apache_start.bat" ]; then
        echo "Starting Apache from C:/xampp..."
        cmd.exe /c "C:\\xampp\\apache_start.bat" >/dev/null 2>&1 &
      fi
    else
      echo "XAMPP was not found in C:/xampp. Start MySQL manually from XAMPP Control Panel."
    fi
    ;;
  Linux*)
    if [ -x "/opt/lampp/lampp" ]; then
      echo "Starting XAMPP from /opt/lampp..."
      sudo /opt/lampp/lampp start
    else
      echo "XAMPP was not found in /opt/lampp. Start MySQL manually."
    fi
    ;;
  *)
    echo "Unknown OS. Start MySQL manually if it is not already running."
    ;;
esac

echo "Waiting for services..."
sleep 3

echo "Starting backend and frontend..."
cd "$ROOT_DIR"
npm run dev

