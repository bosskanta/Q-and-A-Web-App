let dbURI = 'mongodb://localhost:27017/CS485_project';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MONGO_URI; // production DB server
}
export const config = {
    database: dbURI,
    userMongoClient: true,
    connectOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
}
// To setup production and mongo uri env. Use:
// c:\> NODE_ENV=production MONGO_URI=mongodb:// :@:/ nodemon start