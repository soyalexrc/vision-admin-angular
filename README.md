# Vision Admin Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.9.

This is the Administration of the company Vision Inmobiliaria Venezuela

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Upload changes
Run `npm run build:major` or `npm run build:minor` or `npm run build:patch` to update the project versioning. 

This and build and push the docker project inside `pruebacontainerluighi2693` account

Keep in mind that when you run any of these commands, you need to track the changes from the package.json (the version number)



## build image

`docker build --platform linux/amd64 -t pruebacontainerluighi2693/vision-admin-angular-frontend:latest .`
## push dockerhub

1. `docker push pruebacontainerluighi2693/vision-admin-angular-frontend:latest`

2. `docker stop $(docker ps | grep 'vision-admin-angular-frontend:latest' | awk '{print $1}')`

3. `docker rm $(docker ps -a | grep 'vision-admin-angular-frontend:latest' | awk '{print $1}')`

4. `docker image rm $(docker image ls | grep 'pruebacontainerluighi2693/vision-admin-angular-frontend' | grep -v 'site' | awk '{print $3}')`

5. `docker run -d -p 3002:80 pruebacontainerluighi2693/vision-admin-angular-frontend:latest`

