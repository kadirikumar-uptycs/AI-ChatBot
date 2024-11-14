const isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            return next();
        } else {
            return res.status(401).send({ message: 'Unauthorized!' });
        }
    } catch (err) {
        console.log(`error while validating user access\n${err}`);
        if (err.code === 'ECONNRESET') {
            return res.status(500).send('Connection was reset by the server');
        } else {
            return res.status(500).send({ message: 'Internal Server Error' });
        }
    }
};

module.exports = isAuthenticated;