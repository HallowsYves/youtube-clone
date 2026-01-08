# node 18 is built ontop of linux image
FROM node:18

# Set workign directory
WORKDIR /app

# copy package.json
COPY package*.json ./

# install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Install packages needed
RUN npm install

# Copy source code
COPY . . 

# make port 300 Available outside the container
EXPOSE 3000

CMD ["npm", "start"]