# CollabSeek

## Authors

* **Mac Watrous** - [MacWatrous](https://github.com/MacWatrous)
* **Alden Caron-O'Neill** - [aldencaron](https://github.com/aldencaron)
* **Max Booth** - [maxhbooth](https://github.com/maxhbooth)
* **Marcus Wallace** - [marcus2018w](https://github.com/marcus2018w)

A website hosted on UNC cloudapps that allows academics with unc.edu emails to make
profiles based on research skill sets and interests and then to connect other local researchers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing


#### Github

The code can be found at https://github.com/maxhbooth/CollabSeek-Backend.  Clone this repository onto your computer to run it.  However, note that if you want to change want to make changes to the codebase, you may want to create a new remote github repository to serve as the source repository for the cloud apps pod.  Creating a github repository and cloning the current github repository instructions can be found at  https://help.github.com/articles/duplicating-a-repository/.  Then, changing the source repository for a cloudapp pod can be found at https://help.unc.edu/help/carolina-cloudapps-git-service/.  


#### Basic Installation for Running Code Locally

Install Node.js with version 6 or greater (and potentially an IDE such as WebStorm.)
Install openshift command line tools at https://help.unc.edu/help/carolina-cloudapps-installing-the-command-line-cli-tools/.
Go to the cloned repository directory and run “npm install.”  This will install all the remaining tools that the code requires.  
Now, to run the code, set up port-forwarding so that the local server can access the remote database using the command line tools, and create the appropriate environmental variables.


#### Setup Port-Forwarding

After setting up the command line tools, you should be able to run “oc login” to connect to the unc cloud apps server.  This requires either being on the campus network, or using the unc vpn service.
Once connected you will need to run “oc port-forward pod-name localport:5432”.  For example, to connect to the test database, you can run “oc port-forward postgresqltest-3-jmxlp 15432:5432.”  
The pod-name can be gotten by using “oc get pods”
The localport needs to match what is set in the environmental variables.


#### Setup Environment Variables

To run locally, we need to set some environmental variables.  You can either set literal environmental variables on your machine, or you can create a file named “.env” and include it within the root of the cloned repository.  This way you won’t have to remember to actually delete the environmental variables if you wish to delete the project from your computer.  An example of what the environmental variables should be set to is below.  POSTGRESQL_NAME, POSTGRESQL_PASSWORD, POSTGRESQL_USER, POSTGRESQL_SERVICE_HOST, POSTGRESQL_SERVICE_PORT are all used for connecting to the database.  POSTGRESQL_SERVICE_PORT  must match the port number that is being port-forward in the oc command above.  NODE_EMAIL, NODE_PASS, NODE_EMAIL_SERVICE are used to control the email service that the server uses.  COLLAB_LINK is used to customize emails that are sent by the service.


#### Example Environmental Variables:
```
POSTGRESQL_NAME=collabseekdbtest
POSTGRESQL_PASSWORD=Kl7wadMuPeVeqa2Y
POSTGRESQL_USER=userJA5
POSTGRESQL_SERVICE_HOST=localhost
POSTGRESQL_SERVICE_PORT=15432
NODE_EMAIL = collabuncseek@gmail.com
NODE_PASS = collab123
NODE_EMAIL_SERVICE = smtp.gmail.com
COLLAB_LINK = localhost:8080
```

#### Installing CodeceptJS, Selenium, and WebDriverIO, all required to run tests
```
[sudo] npm install -g selenium-standalone@6.5.0
[sudo] selenium-standalone install
[sudo] npm install -g codeceptjs@1.0.3
[sudo] npm install -g webdriverio
```
#### Redeploying

To restart the service for any reason, go to the cloud apps command console and go to applications -> Deployments.  Choose the pod that you want to restart and click “Deploy” at the top of the page.

To rebuild the service, go to Builds->builds in the cloud apps command console.  Again, choose the pod that you want to rebuild, and click “Build” at the top of the page.  This is required if you want to make any changes to the code, rather than just rebooting the server.



## License

## Acknowledgments

