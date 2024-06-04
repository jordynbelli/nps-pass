# NPS ExpressPass
Welcome to the NPS ExpressPass!

https://github.com/jordynbelli/nps-pass

VIDEO: https://www.loom.com/share/febf3b9346fc447fbf114472e8d47a98?sid=63fb28af-4e41-41dd-8337-5e0bacd15a3c


NPS ExpressPass is an innovative idea for an app that connects to a transponder, streamlining National Park check-ins and reducing traffic in our busiest parks.

# Table of Contents
- Project Overview
- Usage
- Technologies Used
- Installation

# Project Overview
The NPS ExpressPass is designed to enhance your National Park experience by allowing a seamless check-in process, minimizing wait times, and reducing traffic congestion. The concept revolves around an ExpressPass transponder that mounts to the inside of your windshield. This transponder allows for a streamlined check-in without waiting in line, ultimately contributing to a better park experience. All your passes, permits, and reservations are uploaded to the transponder, which is then scanned upon park entry in the National Parks ExpressLane.



# Usage
While many travel thousands of miles for the most sought-after National Parks, it’s no surprise that the busiest parks also have the worst traffic. NPS ExpressPass connects to an ExpressPass transponder, mounted inside your windshield, to streamline check-ins and minimize wait times. All of your passes, permits, and reservations are uploaded to the transponder, which is scanned upon park entry in the National Parks ExpressLane.

Until the ExpressPass comes into existence, the site currently uses an API key from nps.gov to populate all of the National Parks and Monuments in a simple search, as well as a Recreation.gov API key for basic campsite searches. The site includes functionality to register, login, edit user details, delete an account, "activate" your pass, and "purchase" a pass.


# Technologies Used
## Frontend
- React
- Axios
- CSS for styling
## Backend
- Flask
- SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- Flask-Bcrypt
## Database
- MySQL

# Installation

## To set up the project locally, follow these steps for the backend:

1. git clone github.com/jordynbelli/nps-pass.git
2. cd nps-pass
3. python3 -m venv venv, and then source venv/bin/activate  # On Windows use `venv\Scripts\activate`
4. pip install -r requirements.txt
5. flask run

## And these steps for the frontend: 

1. cd nps-pass
2. npm install
3. npm start

Thank you for using NPS ExpressPass! Enjoy your visit to the National Parks! 🌲🏞️


