// backend/routes/api/index.js
// Purpose: This file contains the routes for the API of the FoodTrek application.
// Details: This file contains the routes for the API of the FoodTrek application. The code snippet provided is a part of the file that adds a route to test the API. The route responds with the request body as a JSON object.

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

// const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// These imports are for testing User Authentication Middleware purposes only.

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});

// Test User Authentication Middleware //
// If there is no session user, the route will return an error. Otherwise it will return the session user's information.
// router.get('/require-auth', requireAuth, (req, res) => {
//     return res.json(req.user);
// });

// After manually removing the token cookie, when we refresh the page, the token cookie should be restored and the JSON response should be empty.
// router.get('/restore-user', (req, res) => {
//     return res.json(req.user);
// });

// This route will set a token cookie for the user with the username 'Demo-lition' and return the user's information.
// router.get('/set-token-cookie', async (req, res) => {
//     const user = await User.findOne({
//         where: {
//             username: 'Demo-lition'
//         },
//     });
//     setTokenCookie(res, user);
//     return res.json({ user: user });
// });

// Test
// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
// });

module.exports = router;