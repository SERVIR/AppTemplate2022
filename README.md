# About this Project

The SERVIR Project, NASA, USAID and [Hub organization name] make no express or implied warranty of this [data/application/sofware] as to the merchantability or fitness for a particular purpose. Neither the US Government nor its contractors shall be liable for special, consequential or incidental damages attributed to this [data/application/sofware] .

### Prerequisites

You need the following in order to set up this project.

* Create credentials by following the steps in from https://docs.google.com/document/d/1jn3abOHUM5EpfrSipWUPYV-KhphzKVbGNGSLUBPGuHA/edit
    * You will need the key JSON file, client ID, client secret key and service account detaills
  
* Python 3.10
* Django 4.1.3
* Install and authenticate earth engine using your google account and enable Earthengine API 

### Installation

Please follow the instructions to set up the project
* Clone the project from the Github repository
* From the root directory install the requirements by running the following command 

```  
  pip install -r requirements.txt
```
* Edit the data.json with the details 
* Edit the WebApp/config.py with respective details
* Start the app using "python manage.py runserver" from the root directory

### Walkthrough

####Home
* Home page is the welcome page that has the hero image and information about the project. 
####Maps
* There are three types of maps
  * WMS fixed size
  * WMS full page
  * GEE layers
####Charts
* There are three types of charts
  * Chart from netCDF
  * Chart from data model
  * Chart from ClimateSERV API
####About
* Information about the project, team and logos
####Feedback
* If a user wants to send comments to the owner of the website, he can do it using a google form that is provided here.
