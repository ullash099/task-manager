
## Server Requirment
1. Need PHP 7.4
2. Node v16.6.0


## How to Deploy 

1. Go to the folder application using cd

step 2-5 if needed
2. Run "composer install" on your cmd or terminal (composer install - -ignore-platform-reqs)
3. Copy .env.example file to .env on root folder. 
    You can type "copy .env.example .env" if using command prompt Windows 
     or "cp .env.example .env" if using terminal Ubuntu
4. Open your .env file and change the database name (DB_DATABASE)
5. Run "php artisan key:generate"

6. set database name, database user & password in .env file
7. Run "php artisan migrate"
7. Run "php artisan serve"