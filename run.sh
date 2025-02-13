#!/bin/bash

cd back-end
npm run start &
BACKEND_PID=$!

cd ../front-end
npm run dev &
FRONTEND_PID=$!

# Set up a trap to catch SIGINT (Ctrl+C) and kill the background processes
trap 'kill $BACKEND_PID $FRONTEND_PID' SIGINT

# Wait for both processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID
