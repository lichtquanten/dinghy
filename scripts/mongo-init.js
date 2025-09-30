const dbName = process.env.DB_NAME
const username = process.env.APP_DB_USER
const password = process.env.APP_DB_PASSWORD

const db = db.getSiblingDB(dbName)
db.createUser({
    user: username,
    pwd: password,
    roles: [{ role: "readWrite", db: dbName }],
})
