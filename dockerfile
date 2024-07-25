FROM node:20-alpine

# RUN mkdir -p /home/app


# default dir that next command execute in /home/app dir
WORKDIR /home/app 

COPY . .
# run npm install in /home/app
RUN npm install


RUN npm run build

EXPOSE 4455

# not cd to folder becase of WORKDIR
CMD ["node", "dist/index.js"]