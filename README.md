# hapi-ts-scaffold

##### Hapi Typescript scaffold project 

 [![npm version](https://badge.fury.io/js/hapi-ts-scaffold.svg)](https://badge.fury.io/js/hapi-ts-scaffold) [![Build Status](https://travis-ci.org/ashokjayaprakash/hapi-ts-scaffold.svg?branch=master)](https://travis-ci.org/ashokjayaprakash/hapi-ts-scaffold)

 List of features available in this project  
 * Generate Hapi typescript starter project
 * Generate independent controller with route (**GET/POST/PUT/DELETE**)
 * Pre-defined gulp task to compile and run server.
 
#####  Work in Progress 
 * Entity creation for Model
 * Joi validation for API 
 * Swagger documentaion integration

### Contribution
Possible ways to contribute this project
* Raising issues 
* Writing unit test cases
* Developing Work in Progress items

For any queries reach my email ashokjp93@gmail.com

#### Steps to kickstart with hapi typescript scaffold   

1.) Install hapi-ts-scaffold globally

```javascript
npm install -g hapi-ts-scaffold 
```

2.) To generate new project use the following command

```javascript
// hapi-ts-scaffold <project-name>
ht create helloWorld
```
3.) To create new module, navigate to root folder helloWorld  
```javascript

cd helloWorld

// hapi-ts-scaffold -m <module-name>
ht -m user
```

Generated folder structure above executed command
```
----helloWorld
|   gulpfile.js
|   package.json
|   tsconfig.json
|   tslint.json
\---app
    |   config.ts
    |   server.ts  
    \---modules
        +---helpers
        |       Logger.ts
        \---helloWorld
                HelloWorldController.ts
                HelloWorldRoute.ts
        \---user
                UserController.ts
                UserRoute.ts
```
4.) Npm install to install all required modules  
```javascript
npm install
```
5.) To run the application
```javascript
npm start
```
6.) Application will be running on following port
```javascript
http://0.0.0.0:3000
```


