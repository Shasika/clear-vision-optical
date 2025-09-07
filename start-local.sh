#!/bin/bash

# Start the Optical Website locally
echo "🚀 Starting Optical Website Local Development..."

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check ports
check_port 3001 || echo "Backend server may already be running on port 3001"
check_port 5173 || echo "Frontend server may already be running on port 5173"

# Start backend server in background
echo "📡 Starting backend server..."
cd server && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "🖥️  Starting frontend server..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Local development servers started:"
echo "   🖥️  Frontend: http://localhost:5173/"
echo "   📡 Backend:  http://localhost:3001/"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup when script exits
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait