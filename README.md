Sure thing! Here's the complete `README.md` content you can copy and paste:

```markdown
# creaTourn-frontend

This project is the frontend part of a tournament management system, where users can set up, customize, and manage tournaments.

## Project Structure

The application uses a JSON-based configuration for defining tournament properties and behaviors through various blocks like `vsBlock`, `startListBlock`, `randListBlock`, etc.

### Main JSON Template

```javascript
var tournamentJson = {
  // ... (include the rest of your tournamentJson structure here)
};
```

### Auxiliary Variables and Blocks

```javascript
var player = {
  // ... (player structure)
};

var vsBlock = {
  // ... (vsBlock structure)
};

// Include other block definitions here
```

Replace placeholders (`'STRING'`, `INTEGER`, etc.) with actual data as required.

# creaTurn-backend

The backend service for the tournament management system, implemented with Node.js, Express, and MongoDB.

## Installation

Install the required dependencies:

```bash
npm install node express mongodb
```

Ensure MongoDB is running on the default port `27017` and the database `creatourn` is created.

## Running the Server

Start the server to listen on `http://localhost:2000`:

```bash
node server.js
```

The server accepts connections from the frontend running on `http://localhost:3000`.

## API Endpoints

### Templates

- Get a Template: `GET /templates/:id`
- List Templates: `GET /templates`
- Create a Template: `POST /templates/`
- Update a Template: `PUT /templates/:id`
- Delete a Template: `DELETE /templates/:id`

### Tournaments

- Get a Tournament: `GET /tournaments/:id`
- List Tournaments: `GET /tournaments`
- Create a Tournament: `POST /tournaments/`
- Update a Tournament: `PUT /tournaments/:id`
- Delete a Tournament: `DELETE /tournaments/:id`

## Response Format

Responses are in the following format:

```json
{
  "success": true,
  "message": "Error message, if any",
  "data": "Response data here"
}
```

For detailed response structure, refer to the respective GET, POST, PUT, DELETE operations.
