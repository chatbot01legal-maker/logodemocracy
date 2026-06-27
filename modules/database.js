const{

MongoClient

}

=

require(

"mongodb"

);

const uri=

process.env

.MONGODB_URI;

let db;

async function connect(){

if(db)

return db;

const client=

new MongoClient(uri);

await client.connect();

db=

client.db();

return db;

}

async function saveUser(

user

){

const database=

await connect();

return database

.collection(

"users"

)

.insertOne(

user

);

}

async function getUser(

email

){

const database=

await connect();

return database

.collection(

"users"

)

.findOne({

email

});

}

module.exports={

connect,

saveUser,

getUser

};

