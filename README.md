![alt text](JAM-logo.png "Jam Logo")

A real-time application that provides a way to bid on an item, or even allow a user to post an item to be up for auction.

Check it out: https://jam-fjnw.herokuapp.com/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them:

* node (8.9.1) or later (Download from [NodeJS](https://nodejs.org/en/download/))
* Google Map API Key (You can obtain one here: [Get API Key](https://developers.google.com/maps/documentation/javascript/get-api-key))_You will need to create an .env file in the root directory._
* Cloudinary (Image file hosting) (You can obtain your credentials here: [Sign Up](https://cloudinary.com/))
* MySQL (If you want to run it locally.) (Installer can be found under the download section of [MySQL](https://www.mysql.com/))

### Installing

Install the required packages to help you build the app.

```
run `npm install -g create-react-app`
run `npm install -g yarn`
```

Navigate to the folder where you would like to store the app. In that folder, run the following command:

```
run `git clone https://github.com/JamBid/Jam.git` (If there are errors due to permission, download the repo as a zip and replace the files in the jam folder with the ones from the zip.)
cd jam
run `yarn install`
```

**THIS STEP CANNOT BE SKIPPED ON ANY ENVIRONMENT (where an .env file is needed)**

*In the root directory of the app (Jam folder), create .env file with the following properties: **_ORDER DOES MATTER_**
_If you cannot remember the info, the Cloudinary Info is at [Cloudinary Console](https://cloudinary.com/console) and the Google API Keys are at [Google Dev Console](https://console.cloud.google.com/)_
* REACT_APP_GOOGLEMAP=**_Google Api Key_**
* CLOUDINARY_NAME =**_Cloudinary name_**
* CLOUDINARY_APIKEY =**_Cloudinary API Key_**
* CLOUDINARY_APISECRET =**_Cloudinary API Secret_**


To run the app locally, use the following command:
```
yarn dev
```

## Configuring the databases
### Dev

In your editor of choice or cml, connect to the database and then run and commit the following code:

* [db/create_schema.sql](db/create_schema.sql)
* [db/create_user.sql](db/create_user.sql)
* [db/create_tables.sql](db/create_tables.sql)


The username and password can only connect to the database from the *localhost (127.0.0.1)* IP address:
```
username: jb_user
password: jb_1234
```

If you want to use the test data, please run the following script to generate random data from the Jam folder:
**_This will erase everything in the database!!!_**
```
`node db/seeder/seed.js #1 #2 #3 #4 #5`
```
* Replace the **#1** with an integer for how many users to generate. *(Required)*
* Replace the **#2** with an integer for the number of products to insert. *(Optional: If you put a 0 for users, this will throw a warning.) _(Must have a 0 if you want to provide a value for questions, answers, and bids.)_*
* Replace the **#3** with an integer for the number of questions to insert. *(Optional: If you put a 0 for products, this does nothing.) _(Must have a 0 if you want to provide a value for answers and/or bids.)_*
* Replace the **#4** with an integer for the number of answers to insert. *(Optional: If you put a 0 for users, this will do nothing.) _(Must have a 0 if you want to provide a value for bids.)_*
* Replace the **#5** with an integer for the number of bids to insert. *(Optional: If you put a 0 for users, this will do nothing. If you put 1 for users, this will show a warning.)*

After the seeder has finished, the login info will be as follow:
* Username: user# **(The # is the number for which user you want to log in as, such as user1.)**
* Password: 1234


### Prod

#### Heroku (You will need *Clear DB* addon)
In you editor of choice or cml, connect to the database and then run and commit the following code to the database:

* [db/create_tables.sql](db/create_tables.sql)

#### In the settings of your app on Heroku, reveal the Config Vars and add the following _Name Does Matter_.
* REACT_APP_GOOGLEMAP **_Google Api Key_**
* CLOUDINARY_NAME **_Cloudinary name_**
* CLOUDINARY_APIKEY **_Cloudinary API Key_**
* CLOUDINARY_APISECRET **_Cloudinary API Secret_**



## Deployment

### Heroku
To push to Heroku, follow the commands (Note: You must have set your git to have a Heroku remote configred. Full directions can be found here [Deploying with Git](https://devcenter.heroku.com/articles/git))

Make sure to have the latest code commit first.
```
git push heroku master
```

## Additional Notes
If you want to point the app to another database, you will need to edit the configuration in the [config](server/config/connections.js) file.

## Built With

### Javascript libraies
* [axios](https://github.com/axios/axios)
* [body-parser](https://github.com/expressjs/body-parser)
* [cloudinary](https://cloudinary.com/documentation/node_image_upload#server_side_upload)
* [dateformat](https://github.com/felixge/node-dateformat)
* [dotenv](https://github.com/motdotla/dotenv)
* [express](https://expressjs.com/)
* [fs](https://nodejs.org/api/fs.html)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [moment](https://momentjs.com/)
* [multer](https://github.com/expressjs/multer)
* [path](https://nodejs.org/api/path.html)
* [react-datepicker](https://www.npmjs.com/package/react-datepicker)
* [react-google-maps](https://github.com/tomchentw/react-google-maps)
* [react-moment](https://github.com/headzoo/react-moment)
* [react-responsive-carousel](https://github.com/leandrowd/react-responsive-carousel)
* [react-table](https://react-table.js.org/#/story/readme)
* [react-toastify](https://github.com/fkhadra/react-toastify)
* [Socket.io](https://socket.io/)


### Applications
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/)
* [MySQL](https://www.mysql.com/)
* [Node JS](https://nodejs.org/en/)
* [ReactJS](https://reactjs.org/)


### Dev packages
* [faker](https://github.com/marak/Faker.js/)
* [concurrently](https://github.com/kimmobrunfeldt/concurrently)
* [nodemon](https://nodemon.io/)

## Authors

* **Andrew Damico** - [AndrewD14](https://github.com/AndrewD14)
* **Jamal** - [fjnw](https://github.com/fjnw)
* **Muri** - [muri03](https://github.com/muri03)

## Acknowledgments

* Hat tip to anyone who's code was used
* Thank you to the instructors and TA's in the Northwestern Coding Boot Camp
