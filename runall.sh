

# node /opt/dev/backend/index.js & http-server /opt/dev/frontend/dist/ -p 4200  & 
printf "\n\n--- Everything should be running now.  --- \n Server: http://localhost:5000 \n App: http://localhost:4201  \n\n"

http-server /opt/dev/frontend/dist/ -p 4200 & 
cd /opt/dev/backend/ && node index.js &