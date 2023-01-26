# About this Project

This repository is intended to be used as a base template to use for development of custom applications. It contains
several commonly used elements implemented in separate pages so that developers can remove or combine them to build
interfaces addressing complex use-cases.

### Technology stack

* Python 3.9
* Django 4.1.3
* Bootstrap 5.2.2
* Google Earth Engine Python API

### Google Earth Engine Authentication

You need the following in order to set up this project.

* Create credentials by following the steps in
  from https://docs.google.com/document/d/1jn3abOHUM5EpfrSipWUPYV-KhphzKVbGNGSLUBPGuHA/edit
    * You will need the key JSON file, client ID, client secret key and service account details

* Install and authenticate earth engine using your Google account and enable Earthengine API

### Installation

Please follow the instructions to set up the project

* Clone the project from the Github repository
* From the root directory, create the environment by running the following command

```  
  conda env create -f environment.yml
```

* Create data.json in the root directory. Copy and paste the json object below into the file, then edit the values.

```json
{
  "SECRET_KEY": "your_secret_key",
  "ALLOWED_HOSTS": ["localhost", "127.0.0.1"],
  "CSRF_TRUSTED_ORIGINS": ["http://localhost:8000","http://127.0.0.1:8000"],
  "private_key_json" : "your_json_key",
  "DATA_DIR" : "your_data_path",
  "service_account" : "your_service_acccount",
  "sample_netCDF": "path_to_netCDF_file"
}
```

* Run migrations to create the database tables:
                    ```python manage.py makemigrations```
  followed by
                    ```python manage.py migrate```
* Run the server: 
                    ```python manage.py runserver```
* Open a web browser and navigate to http://127.0.0.1:8000/ to access the application.


### Walkthrough

#### Home

* Home page is the welcome page that has the description of the application along with navigation provided to the various available templates. 

#### Maps

* There are three types of map templates
    * Display WMS data using fixed-size view
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/fixed.png?raw=true)

    * Display WMS data using full screen view
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/full.png?raw=true)

    * Display GEE data using a fixed-size view
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/gee.png?raw=true)

#### Charts

* All the charts use HighCharts library to generate the chart using data. There are three types of chart templates:
    * Chart from netCDF file
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/netcdf.png?raw=true)

    * Chart from SQLite data model
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/dm.png?raw=true)

    * Chart from ClimateSERV API
      ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/cserv.png?raw=true)

#### Update Data Model

* To update data model details, please login using the 'Login' button in the menu bar. It will redirect you to your
  Google(Gmail) login page. After you are authenticated, navigate to the "Update Data Model" page from the home page.
  Here, you will see the form that allows you to enter details and submit to the server.
        ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/update.png?raw=true)


#### About

* This page has information about the project, team and logos

#### Feedback

* A sample google form is used to collect feedback information for the application.

#### Graphic design

This application template is built using Bootstrap, based
on [https://startbootstrap.com/theme/sb-admin-2](https://startbootstrap.com/theme/sb-admin-2)

## Contact

Please feel free to contact us if you have any questions.

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