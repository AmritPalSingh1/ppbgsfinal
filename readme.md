# Project Setup

## Virtual Environment

### Create venv
```
$ python3 -m venv ./venv
```
### Activate the environment
For mac:
```
$ source ./venv/bin/activate
```
For windows:
```
$ .\venv\Scripts\activate.bat
```

## Clone the project
```
$ git clone https://github.com/ASingh369/ppbgsfinal.git
```

## Install pip modules from requirements
```
$ pip install -r requirements.txt
```

## Postgres Database
Create a postgres database [postres](https://www.postgresql.org/docs/9.1/manage-ag-createdb.html)

### Settings Setup
Edit jstutorials/settings.py to connect with the database you created

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'database_name',
        'USER': 'postgres_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': 'port_no (eg: 5432)'
    }
}
```

## Run Migrations
```
$ python manage.py makemigrations
$ python manage.py migrate
```

## Create super user
```
$ python manage.py createsuperuser
```

## Create static files
```
$ python manage.py collectstatic
```

## Install dependencies
```
$ npm install
$ npm run build
```

## Run server
```
$ python manage.py runserver
```