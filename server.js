console.log('May Node be with you')
// 
const express = require('express')
const app = express()
const {MongoClient} = require('mongodb')


app.listen(3000, function () {
    console.log('listening on 3000')
})



async function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = `mongodb+srv://tejasvshetty:<password>@<clustername>.mongodb.net/?retryWrites=true&w=majority`;
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        await helper(client);





        // await listDatabases();
        // *******

        // await createListing(client, {
            
        // })
        // *******

        // await createMultipleListing(client,[
        //     {
        //         name: "Views",
        //         summary: "There are many"
        //     },
        //     {
        //       name: "Castle",
        //       summary: "A small castle with several views"
        //     }])
        // *******

        // await findOneListingByName(client, "Views")
        // *******

        // await findListingMin(client, {
        //     minimumNumberOfBedrooms: 4,
        //     minimumNumberOfBathrooms: 2,
        //     maximumNumberOfResults: 5
        // });
        
    } finally {
        // Close the connection to the MongoDB cluster
        // await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:")
    databasesList.databases.forEach(db =>{
        console.log(`-${db.name}`)
    })
}

async function createListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)
    console.log(`New listing created with the following id: ${result.insertedId}`)
}

async function createMultipleListing(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listings created with the following id(s):`);
    console.log(result.insertedIds);

}

async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing})
    if (result){
        console.log(`Found a listing in the collectio  with the name ${nameOfListing}`)
        console.log(result)
    }
    else {
        console.log(`No listings found with the name ${nameOfListing}`)
    }
}

async function findListingMin(client, {
    minBed = 0,
    minBath = 0,
    maxNum = Number.MAX_SAFE_INTEGER
}={}){
        const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find(
        {
        bedrooms: {$gte: minBed},
        bathrooms: {$gte: minBath}
        }).sort({last_review: -1})
        .limit(maxNum);

        const result = await cursor.toArray();
        if (result.length > 0) {
            console.log(`Found listing(s) with at least ${minBed} bedrooms and ${minBath} bathrooms:`);
            results.forEach((result, i) => {
                date = new Date(result.last_review).toDateString();
    
                console.log();
                console.log(`${i + 1}. name: ${result.name}`);
                console.log(`   _id: ${result._id}`);
                console.log(`   bedrooms: ${result.bedrooms}`);
                console.log(`   bathrooms: ${result.bathrooms}`);
                console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
            });
        } else {
            console.log(`No listings found with at least ${minBed} bedrooms and ${minBath} bathrooms`);
        }

}

async function helper(client){
    const bodyParser = require('body-parser')

    app.use(bodyParser.urlencoded({extended:true}))
    app.get('/', (req,res) => {
        res.sendFile('C:/Users/tejas/WebDev/zellwk'+'/index.html')
    })

    app.post('/quotes', (req,res)=>{
        const x_return = req.body;
        createListing(client, req.body)
    })
}

