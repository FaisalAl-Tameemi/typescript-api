docker-compose run api rm -rf node_modules
docker-compose run api npm install -g nodemon yarn
docker-compose run api yarn install
docker-compose down
