module.exports = {
    "port": process.env.PORT || 3000,
    "sessionConfig": {
        secret: "livelong&prosper",
        resave: false,
        saveUninitialized: true
    }
}