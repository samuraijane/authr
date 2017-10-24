## authR
authR is a simple application to teach students the basics in authentication.

#### Instructions
+ ` git clone ` this repository to your local machine.
+ Run ` npm install ` to download the dependencies this application needs.
+ Create a local database in MongoDB and import the both the *characters* collection and the *users* collection (see the two steps below).
+ ` mongoimport --db authr --collection characters --drop --file ~/yourpathto/seed-data-characters.json `.
+ ` mongoimport --db authr --collection users --file ~/yourpathto/seed-data-users.json `.
+ You can find these files in the folder entitled *mock-data*. The credentials for the one user that you import are *username*: Joe and *password*: joe.
+ Start the server for the database with `mongod`.
+ In a separate terminal window, run `gulp watch` to start the node server.
+ Navigate to *localhost:3001* in a browser to begin using this application.
