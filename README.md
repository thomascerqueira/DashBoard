# DashBoard
- [DashBoard](#dashboard)
  - [Compilation](#compilation)
  - [Services](#services)

## Compilation
To compile we need some pieces of information for the server.<br/>
For that we need to use ```make MODE={MODE}```
where ```{MODE}``` is either ```start``` to start with ```node``` or ```start.dev``` to start with ```nodemon```

The make option are:
* ```make runServe MODE=``` to only run the server
* ```make runDash``` to only run the client
* ```make MODE=``` to run both

We need a .env file containing this following value:
* REACT_APP_API_KEY
* REACT_APP_AUTHDOMAIN
* REACT_APP_DATABASEURL
* REACT_APP_PROJECTID
* REACT_APP_STORAGEBUCKET
* REACT_APP_MESSASGINGSENDERID
* REACT_APP_APPID
* REACT_APP_MEASUREMENTID
* REACT_APP_APIWEATHER
* REACT_APP_WEATHERURL
* REACT_APP_WEATHERIMG
* REACT_APP_KEY_STEAM
* REACT_APP_STEAM_URL
* REACT_APP_STEAM_LIST
* REACT_APP_STEAM_INFO_GAME
* REACT_APP_CINEMA_API_KEY
* REACT_APP_CINEMA_READ_ACCESS_TOKEN
* REACT_APP_TOKEN
* REACT_APP_URL



## Services
| Services | Widgets |
| :------- | :------ |
| **Steam** | Print number of actual player of a game
|       | Print image of the game|
| **Weather** | Print the temperature of the city selected |
|| Print the humidity of the city selected |
||Print the wind of the city selected|
|**Cinema**| Print a list of recent film |
||Print image of the film|
||Print the description of the film|
