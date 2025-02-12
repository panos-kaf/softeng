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

# Wait for both npm installs to complete
wait

# Start back-end
cd ../back-end
npm run start &  # Run back-end in the background

# Start front-end
cd ../front-end
npm run dev &  # Run front-end in the background

# Wait for both processes to finish
wait~
