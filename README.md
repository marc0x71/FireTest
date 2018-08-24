# FireTest example app using Firebase Hsting and RealTime Database

## Install firebase tools
npm i -g firebase-tools
firebase login

## Create project structure

mkdir fire-test
cd fire-test
firebase init hosting
firebase init functions

## Install Express, Handlebars and others

cd functions
npm i express body-parser handlebars consolidate joi express-validation --save

## Start local server

firebase serve --only functions,hosting

# Deploy

firebase deploy





