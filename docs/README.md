# AdvancedNodeStarter

Starting project for a course on Advanced Node @ Udemy

## RUNNING APP IN DEVELOPMENT MODE

0. Add a dev.js file to `config/` (see below for what it should contain)
1. Make sure you have installed redis and have launched redis-server.exe
1. type `npm run dev` to start server and launch client app

## Sample dev.js file

```
module.exports = {
  googleClientID:
    yourGoogleClientIDHere,
  googleClientSecret: yourGoogleClientSecretHere,
  mongoURI: yourDatabaseConnectionAddressHere,
  cookieKey: '11111111'
};
```

For the above to work, you need to set up an oauth app with google and a mongoDB database
