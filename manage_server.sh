#!/bin/bash

# Elacity Server Management Script
PLIST_PATH="$HOME/Library/LaunchAgents/com.elacity.server.plist"
SERVICE_NAME="com.elacity.server"

case "$1" in
    start)
        echo "Starting Elacity server..."
        launchctl load "$PLIST_PATH"
        sleep 2
        echo "Server started. Check status with: $0 status"
        ;;
    stop)
        echo "Stopping Elacity server..."
        launchctl unload "$PLIST_PATH"
        echo "Server stopped."
        ;;
    restart)
        echo "Restarting Elacity server..."
        launchctl unload "$PLIST_PATH" 2>/dev/null
        sleep 1
        launchctl load "$PLIST_PATH"
        sleep 2
        echo "Server restarted. Check status with: $0 status"
        ;;
    status)
        echo "Checking Elacity server status..."
        if launchctl list | grep -q "$SERVICE_NAME"; then
            echo "✅ Service is loaded in launchctl"
            if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
                echo "✅ Server is responding on port 8000"
                curl -s http://localhost:8000/api/health | python3 -m json.tool
            else
                echo "❌ Server is not responding on port 8000"
            fi
        else
            echo "❌ Service is not loaded in launchctl"
        fi
        ;;
    logs)
        echo "Showing server logs (press Ctrl+C to exit):"
        tail -f logs/server.log
        ;;
    errors)
        echo "Showing error logs:"
        if [ -f logs/server.error.log ]; then
            tail -20 logs/server.error.log
        else
            echo "No error logs found."
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|errors}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the Elacity server"
        echo "  stop    - Stop the Elacity server"
        echo "  restart - Restart the Elacity server"
        echo "  status  - Check if the server is running"
        echo "  logs    - Show live server logs"
        echo "  errors  - Show recent error logs"
        exit 1
        ;;
esac

exit 0 