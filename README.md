<p align="center">
<img width="100px" alt="auth0" src="https://github.com/M-Ivan/nestjs-auth0/assets/72365253/228a22d3-37ab-4a1c-ac7b-0155893c508e"/> <img width="100px" alt="nestjs" src="https://github.com/M-Ivan/nestjs-auth0/assets/72365253/1fff224e-6d4a-4b98-9d82-870c15e23449" />
</p>

# Nestjs 🤝 Auth0

Template repo for building a NestJS client of a Auth0 tenant.

## Features

- Fully functional auth module, includes 3 core routes:
  - [POST /auth/login](#post-authlogin)
  - [GET /auth/logout](#get-authlogout)
  - [GET /auth/me](#get-authme)
- Auth session refresh on each request.
- Auth session validation guard and decorator (for protected endpoints)
- Integration with auth0 for password grant and refresh token grant flows.
- Cache support for serverless auth sessions.
- TypeORM configuration for DB interactions.
- Organized test files structures with centralized mocks.
- Dockerization of all dependencies.

## Base API Reference

Below you can find a simple reference to the base endpoints of the repo.

##### POST auth/login

- Request URL: https://api_url/auth/login
- HTTP Method: POST
- Request body:

```json
{
  // application/json
  "username": "email@domain", // email or username
  "password": "secret-pass-123"
}
```

- Returns:
  a. Body with following structure

```json
{
  "user": {
    "createdAt": "2024-05-01T00:00:00Z",
    "updatedAt": "2024-05-01T00:00:00Z",
    "userId": "auth0UserId",
    "username": "a unique username",
    "email": "email@domain.com",
    "avatar": "auth0 managed avatar",
    "firstName": "John",
    "lastName": "Doe"
  },
  "sessionId": "uuid-string-randomly-generated" // Raw session id
}
```

b. Signed cookie `session_id`

##### GET auth/logout

Deletes session cookie and session. The user must re-login after calling this endpoint

- Request URL: https://api_url/auth/logout
- HTTP Method: GET
- Returns:

```json
{
  "message": "User logged out."
}
```

##### GET auth/me

Returns the currently logged user.

- Request URL: https://api_url/auth/me
- HTTP Method: GET
- Returns:

```json
{
  "createdAt": "2024-05-01T00:00:00Z",
  "updatedAt": "2024-05-01T00:00:00Z",
  "userId": "auth0UserId",
  "username": "a unique username",
  "email": "email@domain.com",
  "avatar": "auth0 managed avatar",
  "firstName": "John",
  "lastName": "Doe"
}
```

## Environment nice to have

#### Node 20.12.2

This project was developed with Node iron (20.12.2) and it is highly recommended to use the same version to run the project.

#### Docker

While not completely required. It is recommended to have a stable version of docker installed for easier setup. It is required to provision a DB server and a redis store instance. For details on the dockerization check the docker-compose.yml file.

## Installation

Setup of the project includes the main NestJS app depedencies as well as dependant microservices.

```bash
$ docker compose up -d # Setups microservices
$ npm install
```

### Environment vars provisioning

An `example.env` file is attached to the root of the project. You should rename it / copy to `.env` to store the required env vars.

```
$ cp example.env .env
```

## Running the app

The server will listen on the `.env` specified port (default 3000) after running the following command.

```bash
# watch mode
$ npm run start:dev
```

## Testing

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
