#!/bin/bash

# Add SSH key
ssh-add ~/.ssh/github_hmmy_key

# Clone repository
git clone git@github.com:ntua/softeng24-11.git

echo "Installing node dependencies..."

# Navigate to back-end and install dependencies
cd softeng24-11/back-end
npm i &  # Run npm install in the background for the back-end

# Navigate to front-end and install dependencies
cd ../front-end
npm i &  # Run npm install in the background for the front-end

cd ../cli-client
npm i &

# Wait for both npm installs to complete
wait

# Start back-end
cd ../back-end
npm run start &
BACKEND_PID=$!

# Start front-end
cd ../front-end
npm run dev &
FRONTEND_PID=$!

# Set up a trap to catch SIGINT (Ctrl+C) and kill the background processes
trap 'kill $BACKEND_PID $FRONTEND_PID' SIGINT

# Wait for both processes to finish
wait $BACKEND_PID
wait $FRONTEND_PID
