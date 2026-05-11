Hi everyone, here is a quick tutorial on the fetch operation.
For now we will only use the local fetch methods. I will build for Docker later.

Before work add secret key in .env (you will get a .txt from me)
AFTER WORK PLEASE REMOVE THE KEY FROM .env OR THE WORLD WILL EXPLODE

For start we need to start the server

..\EasyCar\EasyCar-Rent>: cd Backend

..\EasyCar\EasyCar-Rent\Backend> uvicorn main:app --reload

INFO:     Will watch for changes in these directories: ['C:..\\EasyCar\\EasyCar-Rent\\Backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [16324] using WatchFiles
INFO:     Started server process [16464]
INFO:     Waiting for application startup.
INFO:     Application startup complete.   
INFO:     127.0.0.1:59563 - "GET / HTTP/1.1" 200 OK
INFO:     127.0.0.1:59563 - "GET /favicon.ico HTTP/1.1" 404 Not Found

Here we go. Our server is up. Just go to http://127.0.0.1:8000 and there must be {"status":"ok"}

You can also go to http://127.0.0.1:8000/docs and find all methods

To shut down the servers just press "Ctrl + C" in command line.

Let's talk about CRUDs.

USERS
For users we have 7 operations
- get_all
Getting all users

- get_by_email
- get_by_phone
- get_by_id
- Getting users by email, phone, id

- create_user
Creating users
Example

- update_user
Updating users.

- delete_user
Deleting users.

Every example you can find in index.html (it is genereted by AI with comments)

If you want add a new user as ADMIN, you will find code in .txt. Just change the id and run the file with "py or python name.py"

CARS

For cars we have a lot operations. Every function you will find in Swagger. I create car.html file with examples. 



Later, I will add rentals and payments.
