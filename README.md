# PERN Stack TypeScript - Authentication and Authorization with JSON Web Tokens

### Backend

This backend application developed in [Node JS](https://nodejs.org/en/) with TypeScript and [Express](https://www.npmjs.com/package/express) performs authentication and authorization according to the [OAuth](https://es.wikipedia.org/wiki/OAuth) standard. For this, I use Access Tokens and Refresh Tokens through the [JSON Web Tokens (JWT)](https://jwt.io/) standard.

I have implemented a PostgreSQL database that we access through the ORM [Prisma.js](https://www.prisma.io/docs/getting-started/quickstart). Through the use of Express and the MVC pattern, I have created a series of routes and controllers so that users can register, log in and log out, as well as refresh their access tokens with their respective refresh tokens that are stored secure in cookies using ' httpOnly ' and other important security flags. For the latter, I use the library [cookie-parser](https://www.npmjs.com/package/cookie-parser).

I have also developed a jwt rotation system to give it more security in the reuse of refresh tokens and so that a user can log in on multiple devices.

### Frontend

The client application made in [React](https://es.reactjs.org/) and TypeScript only handles users. You can register a user with user permissions. If you want to create users with other permissions, you must cold load it into the database. Then you can login and receive an Access Token to check the active users on the Administrator page (You will need a user with administrator permissions), as well as receive a Refresh Token that will be used in case the Access Token expires and be able to continue doing private queries using [Axios](https://axios-http.com/) and [Axios Interceptors](https://axios-http.com/docs/interceptors).

## 💻 Quick start

### Backend

To deploy this project, you must first install the node_modules packages. To do this, open a console with the server path of the project and run:

```bash
npm install
```

After that, make sure you have mongodb installed locally or in the cloud. Then, create an `.env` file in the main directory of the project with the following environment variables:

    PORT=<Port>
    ACCESS_TOKEN_SECRET=<Generate a key>
    REFRESH_TOKEN_SECRET=<Generate a key>
    DATABASE_URI=<Prisma-PostgreSQL Connection>

To generate a random key, I recommend running the following line in a node terminal:

```bash
require('crypto').randomBytes(64).toString('hex');
```

Finally, in the terminal with the server path execute:

```bash
npm run dev
```

### Frontend

As in the backend you need to load the node_modules from the client folder through the `npm install` command, finally run also `npm run dev` to launch the client application.

## 📚 References

- 🔗 [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- 🔗 [NPM: CORS package](https://www.npmjs.com/package/cors)
- 🔗 [NPM: Bcrypt package](https://www.npmjs.com/package/bcrypt)
- 🔗 [How to Safely Store a Password](https://codahale.com/how-to-safely-store-a-password/)
- 🔗 [MDN: HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- 🔗 [Cross-Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)
- 🔗 [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
- 🔗 [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- 🔗 [Intro to JSON Web Tokens](https://jwt.io/introduction)
- 🔗 [All You Need to Know About Storing JWT in the Frontend](https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id)
- 🔗 [NPM: jsonwebtoken package](https://www.npmjs.com/package/jsonwebtoken)
- 🔗 [NPM: cookie-parser package](https://www.npmjs.com/package/cookie-parser)
- 🔗 [Deleting Cookies](http://expressjs.com/en/api.html#res.clearCookie)
