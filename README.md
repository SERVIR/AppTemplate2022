### About this Project

This repository is intended to be used as a base template to use for development of custom applications. It contains
several commonly used elements implemented in separate pages so that developers can remove or combine them to build
interfaces addressing complex use-cases.

### Technology stack

* Python 3.9
* Django 4.1.3
* Bootstrap 5.2.2
* Google Earth Engine Python API

### Walkthrough of the web application pages

#### Home

* Home page is the welcome page that has the description of the application along with navigation provided to the
  various available templates.

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

#### Select AOI on map

* This page lets the user draw a polygon and download corresponding GEOJSON file.
  ![alt text](https://github.com/SERVIR/AppTemplate2022/blob/master/WebApp/static/images/readme/aoi.png?raw=true)

#### About

* This page has information about the project, team and logos

#### Feedback

* A sample google form is used to collect feedback information for the application.

#### Graphic design

This application template is built using Bootstrap, based
on [https://startbootstrap.com/theme/sb-admin-2](https://startbootstrap.com/theme/sb-admin-2)

### Instructions to set up the Project

###### Requirements

* git (https://git-scm.com/download/)

* conda (https://conda.io/projects/conda/en/latest/user-guide/install/index.html)

###### Recommendations

* Clone and run the AppTemplate2022 This will give you the opportunity to see the look and feel of the application. You
  will also be able to view the project structure and all of the template code. At this stage you should start to think
  about which features would be useful in your specific application.
* Start a new project This will allow you to have a unique project name that fits your purpose.
* Bring the WebApp and templates directories from the AppTemplate2022 into your new project.
* Begin modifying the code to use just the features your application needs and connect your data to the application.
* Create a new github repo for your application where you can push updates for version control as well as make it easier
  to get assistance when needed.
* Publish your application to a web server.

###### How to?

1. ##### Clone AppTemplate

    1. Open a terminal or command prompt on your computer.
    2. Navigate to the directory where you want to clone the repository.
    3. Run the command git clone https://github.com/SERVIR/AppTemplate2022.git
    4. Press Enter. This will start the cloning process and create a copy of the repository on your computer in the
       current directory.
    5. After the cloning process is finished, you will find a new directory named AppTemplate2022. This directory
       contains the full copy of the repository including all the files and the full git history.
    6. You can navigate to the newly created directory and start checking it out.
    7. To view the Earth Engine examples you will need an EE account, if you do not currently have one you can sign
       up https://earthengine.google.com/signup
    8. Next you will need to create a google cloud project where you will enable EE and Google Authentication for your
       project. Navigate to https://console.cloud.google.com/projectcreate
    9. Follow the prompts to create the project, you may want to name it Your\_Project\_Name so you can skip this part
       when you set up your application.
    10. After you create the project you must select it from the dropdown in the top
    11. In the left panel under APIs & Services click the "OAuth consent screen" link, then fill out the form with the
        information for your application. There are a few pages with choices, proceed when finished.
    12. In the left panel click "Credentials" link
    13. At the top left click + Create Credentials and select "OAuth 2.0 Client ID"
    14. In the dropdown select "Web Application" and give a name.
    15. In the App Domain fields use the the dev domains for example:
        1. http://127.0.0.1:8000/
        2. http://127.0.0.1:8000/terms-privacy
        3. http://127.0.0.1:8000/terms-privacy
    16. Add Authorized JavaScript origins (you may enable multiple)
        1. Examples:
            * http://localhost:8000
            * http://127.0.0.1:8000
            * https://your\_domain
    17. Add Authorized redirect URIs (you may enable multiple)
        1. Examples:
            * http://localhost:8000/accounts/google/login/callback/
            * http://127.0.0.1:8000/accounts/google/login/callback/
            * https://your\_domain/accounts/google/login/callback/
    18. Copy and save the Client ID and Client secret to your local machine (you will need these later)
    19. Click DOWNLOAD JSON and save
    20. Click save
    21. Click Enabled APIs & Services then click the + Enable APIS AND SERVICES link at the top
    22. Search for Earth Engine, click it, then click enable.
    23. Click Create Credentials again and select service account
    24. Fill out information and click CREATE AND CONTINUE.
    25. Click Select a role and scroll to Earth Engine, then select Earth Engine Resource Viewer
    26. Register the service account https://signup.earthengine.google.com/#!/service\_accounts
    27. Before you can run the application you will need to create a data.json file in the root directory. In this file
        you will need the following:

            {
              "SECRET\_KEY": "your\_secret\_key",
              "ALLOWED\_HOSTS": \["localhost", "127.0.0.1"\],
              "CSRF\_TRUSTED\_ORIGINS": \["http://localhost:8000","http://127.0.0.1:8000"\],
              "private\_key\_json" : "your\_json\_key",
              "DATA\_DIR" : "your\_data\_path",
              "service\_account" : "your\_service\_acccount",
              "sample\_netCDF": "https://thredds.servirglobal.net/thredds/fileServer/mk\_aqx/geos/20191123.nc"
            }
    28. SECRET\_KEY is any random string of characters
    29. ALLOWED\_HOSTS is the domain you will be accessing the site from, in development it will be left as is, in
        production you will remove those and add your actual domain
    30. CSRF\_TRUSTED\_ORIGINS: similar to above except this needs the http or https protocol added
    31. private\_key\_json: is the json file you downloaded from the google console
    32. DATA\_DIR: is a path to any data that will need to be accessed. In the AppTemplate you will also need the sample
        data which you can download from https://thredds.servirglobal.net/thredds/fileServer/mk\_aqx/geos/20191123.nc
        and place it in the DATA\_DIR in a directory named geos
    33. Service\_account is the service account you created above
    34. sample\_netCDF is just a pointer to the download, there is no need to change this.

    35. In the terminal run conda env create -f environment.yml
    36. When the environment is created run conda activate SERVIR\_AppTemplate
    37. Run the command python manage.py migrate
    38. Setup Site by running the following
        ```
         python manage.py shell
         from django.contrib.sites.models import Site
         site = Site()
         site.domain = '{REPLACE WITH YOUR DOMAIN}'
         site.name = '{REPLACE WITH YOUR DOMAIN}'
         site.save()
         Site.objects.all().values()
         exit()
        ```
    39. Look for your domain in the printed QuerySet and the id of the object. This is your SITE\_ID which needs to be
        changed in settings.py if it is not the same.
    40. Run the command python manage.py runserver
    41. Create a super user by running python manage.py createsuperuser
    42. Start the server by running python manage.py runserver If you have an IDE like PyCharm you can just set up the
        project to run with the Run/Debug Configurations.
    43. Navigate to http://127.0.0.1:8000/admin/ and login with your superuser
    44. Add a social application with your Client ID and Secret that you saved when creating the credentials in the
        cloud console.
    45. While in the admin pages you should add a station or two, along with an organization.
    46. Now you can open a browser and navigate to port http://127.0.0.1:8000/ unless you specified a different port in
        your configuration.
    47. For the Chart from SQL Database to show data you will have to go to the “Use forms to enter data” example and
        add some data points for it to graph.
2. ##### Start new project

   In a browser navigate to https://pypi.org/project/SERVIR-Template-CLI/ and follow the installation instructions. If
   you have already created the cloud application and keys from cloning, you may skip those steps and use the same ones
   rather than creating new ones.

3. ##### Modify

   Now you can start modifying the site. You can start by mapping out what features you would like your application to
   have. Then reading the information in the “Learn how to modify this page” popup.
4. ##### Create repo

   Github has full instructions for adding existing code to a new
   repo https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github
5. ##### Publish

    1. Of course the endgame of this is to get your application published and visible to the public. There are hundreds
       or likely thousands of ways to publish a website. I will explain one of them, publishing to Ubuntu using nginx
       and gunicorn. Feel free to publish differently if you would like.
    2. You will need conda, nginx, and gunicorn installed before you start. There are enough resources explaining in
       depth how to install them, so I will avoid duplicating this information.
    3. Follow the directions from Clone AppTemplate above using your repo that you just created instead of the template.
       Make sure you use the domain that will be pointing to your website instead of 127.0.0.1:8000 in all locations.
       Because this is a production website, you will not need to runserver. So stop at direction cc for now.
    4. Run the command python manage.py collectstatic
    5. Add a service to start the application
        1. Create a file located /etc/systemd/system name it your\_project\_name.service Do not use and dashes.
        2. In the file edit and add the following

               \[Unit\]
               Description=your\_project\_name daemon
               After=network.target

               \[Service\]
               User=nginx
               Group=nginx
               SocketUser=nginx
               WorkingDirectory={REPLACE WITH PATH TO APPLICATION ROOT}/your\_project\_name
               accesslog = "/var/log/your\_project\_name/your\_project\_name\_gunicorn.log"
               errorlog = "/var/log/your\_project\_name/your\_project\_name\_gunicornerror.log"
               ExecStart={REPLACE WITH FULL PATH TO gunicorn IN YOUR CONDA ENV}/bin/gunicorn --timeout 60 --workers 5 --pythonpath '{REPLACE WITH PATH TO APPLICATION ROOT},{REPLACE WITH FULL PATH TO YOUR CONDA ENV}/lib/python3.9/site-packages' --bind unix:{REPLACE WITH LOCATION YOU WANT THE SOCK}/your\_project\_name\_prod.sock wsgi:application

               \[Install\]
               WantedBy=multi-user.target
        3. Create a file in /etc/nginx/conf.d named your\_project\_name\_prod.conf and edit and paste the following

                upstream your\_project\_name\_prod {
                  server unix:{REPLACE WITH LOCATION YOU WANT THE SOCK}/your\_project\_name\_prod.sock
                  fail\_timeout=0;
                }

                server {
                    listen 443;
                    server\_name {REPLACE WITH YOUR DOMAIN};
                    add\_header Access-Control-Allow-Origin \*;

                    ssl on;
                    ssl\_certificate {REPLACE WITH FULL PATH TO CERT FILE};
                    ssl\_certificate\_key {REPLACE WITH FULL PATH TO CERT KEY};

                    # Some Settings that worked along the way
                    client\_max\_body\_size 8000M;
                    client\_body\_buffer\_size 8000M;
                    client\_body\_timeout 120;

                    proxy\_read\_timeout 300;
                 proxy\_connect\_timeout 300;
                    proxy\_send\_timeout 300;
                    fastcgi\_buffers 8 16k;
                    fastcgi\_buffer\_size 32k;
                    fastcgi\_connect\_timeout 90s;
                    fastcgi\_send\_timeout 90s;
                    fastcgi\_read\_timeout 90s;


                    location = /favicon.ico { access\_log off; log\_not\_found off; }
                    location /static/ {
                        autoindex on;
                        alias /your\_project\_name/staticfiles/;
                    }

                    location / {
                        proxy\_set\_header Host $http\_host;
                        proxy\_set\_header X-Real-IP $remote\_addr;
                        proxy\_set\_header X-Forwarded-For $proxy\_add\_x\_forwarded\_for;
                        proxy\_pass http://unix:{REPLACE WITH LOCATION YOU WANT THE SOCK}/your\_project\_name\_prod.sock ;
                    }


                }

                # Reroute any non https traffic to https
                server {
                    listen 80;
                    server\_name {REPLACE WITH YOUR DOMAIN};
                    rewrite ^(.\*) https://$server\_name$1 permanent;
                }
        4. Create Alias commands to make starting the application simple by creating a file located /etc/profile.d named
           your\_project\_alias.sh for this you will need a short acronym for you application i’ll use myapp as an
           example

                alias myapp='cd {REPLACE WITH PATH TO APPLICATION ROOT}'
                alias actmyapp='conda activate your\_project\_name'
                alias uomyapp='sudo chown -R ${USER} {REPLACE WITH PATH TO APPLICATION ROOT}'
                alias somyapp='sudo chown -R www-data {REPLACE WITH PATH TO APPLICATION ROOT}'
                alias myappstart='sudo service your\_project\_name restart; sudo service nginx restart; somyapp'
                alias myappstop='sudo service your\_project\_name stop'
                alias myapprestart='myappstop; myappstart'

        5. Now activate the alias file by running source /etc/profile.d/your\_project\_name\_alias.sh
        6. Now you can start the site by running myappstart
        7. When you need to pull any updates from github you will run the following
            1. myapp (changing you to the home directory)
            2. actmyapp (activating your environment)
            3. uomyapp (taking ownership of the app directory)
            4. git pull (gets the updates)
            5. python manage.py collectstatic (collects the static files)
            6. myapprestart (starts the application and gives the server back the ownership of the directory)

### Contact

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