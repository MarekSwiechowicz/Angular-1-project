# creaTourn-frontend

This project is a frontend component designed to manage tournaments, allowing users to create and organize tournament structures using various types of blocks. 

## Project Structure

The core of the project revolves around a `tournamentJson` object which contains all necessary information about a tournament including type, players, owner, and blocks for managing the tournament flow.

### Key Components:

- **Players**: Represents participants in the tournament.
- **Blocks**: Defines different stages of the tournament (e.g., `vsBlock`, `startListBlock`, `randListBlock`, etc.)
- **Logic**: Each block contains logic dictating its behavior in the tournament (e.g., sorting rules, active status).

## JSON Template

Below is a template for the main `tournamentJson` object, along with helper variables and block structures:

```json
// Add your JSON template structure here
