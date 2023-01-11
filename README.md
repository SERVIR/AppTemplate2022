# About this Project

This repository is intended to be used as a base template to use for development of custom applications. It contains
several commonly used elements implemented in separate pages so that developers can remove or combine them to build
interfaces addressing complex use-cases.

### Technology stack

* Python 3.10
* Django 4.1.3
* Bootstrap 5.2.2
* Google Earth Engine Python API ()

### Google Earth Engine Authentication

You need the following in order to set up this project.

* Create credentials by following the steps in
  from https://docs.google.com/document/d/1jn3abOHUM5EpfrSipWUPYV-KhphzKVbGNGSLUBPGuHA/edit
    * You will need the key JSON file, client ID, client secret key and service account detaills

* Install and authenticate earth engine using your google account and enable Earthengine API

### Installation

Please follow the instructions to set up the project

* Clone the project from the Github repository
* From the root directory install the requirements by running the following command

```  
  pip install -r requirements.txt
```

* Create data.json Copy and paste the json object below into the file, then edit the values.

```json
{
  "SECRET_KEY": "your_secret_key",
  "ALLOWED_HOSTS": ["localhost", "127.0.0.1"],
  "CSRF_TRUSTED_ORIGINS": ["http://localhost:8000","http://127.0.0.1:8000"],
  "private_key_json" : "your_json_key",
  "DATA_DIR" : "your_data_path",
  "service_account" : "your_service_acccount"
}
```

* Edit the WebApp/config.py with respective details
* Start the app using "python manage.py runserver" from the root directory

### Walkthrough

#### Home

* Home page is the welcome page that has the hero image and information about the project.

#### Maps

* There are three types of maps
    * WMS fixed size
    * WMS full page
    * GEE layers

#### Charts

* There are three types of charts
    * Chart from netCDF
    * Chart from data model
    * Chart from ClimateSERV API

#### About

* Information about the project, team and logos

#### Feedback

* A sample google form is used to collect feedback information for the application.

#### Graphic design

This application template is built using Bootstrap, based
on [https://startbootstrap.com/theme/sb-admin-2](https://startbootstrap.com/theme/sb-admin-2)

## Contact

### Authors

- [Githika Tondapu (NASA/USRA)](https://github.com/gtondapu)
- [Francisco Delgado (NASA/USRA)](https://github.com/fdelgadosv)
- [Lance Gilliland (NASA/JACOBS)](https://github.com/lgilliland)
- [Billy Ashmall (NASA/USRA)](https://github.com/billyz313)

## License and Distribution

This application is built and maintained by SERVIR under the terms of the MIT License. See
[LICENSE](https://github.com/SERVIR/AppTemplate2022/blob/master/license) for more information.

## Privacy & Terms of Use

This applications abides to all of SERVIR's privacy and terms of use as described
at [https://servirglobal.net/Privacy-Terms-of-Use](https://servirglobal.net/Privacy-Terms-of-Use).

## Disclaimer

The SERVIR Program, NASA and USAID make no express or implied warranty of this application as to the merchantability or
fitness for a particular purpose. Neither the US Government nor its contractors shall be liable for special,
consequential or incidental damages attributed to this application.