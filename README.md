creaTourn V2
creaTourn V2 is a robust tournament management platform, designed to streamline the organization of competitive events. With a backend built on Node.js and Express and data managed by MongoDB, paired with a dynamic frontend, this tool offers a comprehensive solution for creating and managing tournaments and templates.

Table of Contents
Installation
Running the Application
API Reference
Templates
Tournaments
Frontend Component Structure
Usage
Contribution
Contact
License
Installation
Clone the repository:

sh
Copy code
git clone https://github.com/MarekSwiechowicz/creatourn_V2.git
Navigate to the project directory:

sh
Copy code
cd creatourn_V2
Install dependencies:

sh
Copy code
npm install
Ensure MongoDB is running on the default port 27017.

Running the Application
To start the backend server on http://localhost:2000:

sh
Copy code
npm run start-backend
To start the frontend, ensure it's configured to connect to http://localhost:2000 and accepts connections from http://localhost:3000.

sh
Copy code
npm run start-frontend
API Reference
Refer to the backend README for detailed API endpoints for Templates and Tournaments.

Frontend Component Structure
The frontend architecture utilizes JSON structures to represent tournament and template data. Detailed structure definitions are available in the frontend README.

Usage
For managing templates and tournaments, use the API endpoints to create, retrieve, update, and delete data. For the frontend, construct tournament brackets and templates using the provided JSON structure as a guideline.

Contribution
Interested in contributing? Great! You can start by looking at the issues or creating pull requests. For major changes, please open an issue first to discuss what you would like to change. Please ensure to update tests as appropriate.

Contact
For inquiries or support, please email maswiecho@gmail.com.

License
Distributed under the MIT License. See LICENSE for more information.

Project Link: https://github.com/MarekSwiechowicz/creatourn_V2

This project follows the MIT license. For the full license text, refer to the LICENSE file in the repository.

We welcome contributions and suggestions! Thank you for considering creaTourn V2 for your tournament management needs.
