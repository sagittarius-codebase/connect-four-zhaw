
let express = require('express')
let app = express()

/**
 * create a new Error object with status code and message
 *
 * @param status
 * @param msg
 * @returns {Error}
 */
function error(status, msg) {
    let err = new Error(msg)
    err.status = status
    return err
}

/**
 * generates a random GUID:
 * How it works:
 * - Math.random() generates a random number between 0 and 1
 * - + 1 adds 1 to the random number
 * - * 0x10000 -> now we have a number between 0x10000 and 0x10001
 * - |0 converts the number to an integer
 * - toString(16) converts the integer to a hexadecimal string
 * - substring(1) removes the first character of the string
 * - the function is called twice to generate two 4-character strings
 *
 * @returns {string}
 */
function guidGenerator() {
    let S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4())
}

// static files in public directory
app.use(express.static('public'))

// Middleware for API-Key-Check
app.use('/api', function(req, res, next){
    let key = req.query['api-key']

    // key is missing
    if (!key) {
        return next(error(400, 'api key required'))
    }
    // key is invalid
    if (!~apiKeys.indexOf(key)) {
        return next(error(401, 'invalid api key'))
    }
    // correct key
    req.key = key
    next()
})

// allow JSON
app.use(express.json())

// valid API-Keys
const apiKeys = ['wbeweb', 'c4game']

// our data table with some initial data
const data = {1234567890: {demodata: "wbe is an inspiring challenge"}}

// handle GET-Request for /api/data
app.get('/api/data/:id', function(req, res, next){
    let id = req.params.id
    let result = data[id]

    if (result) res.send(result)
    else next()
})

//  handle POST-Request for /api/data
app.post('/api/data', function (req, res, next) {
    let id = guidGenerator()
    data[id] = req.body
    res.send({id})
})

//  handle DELETE-Request for /api/data
app.delete('/api/data/:id', function(req, res, next){
    let id = req.params.id
    delete data[id]
    res.sendStatus(204)
})

//  handle PUT-Request for /api/data
app.put('/api/data/:id', function(req, res, next){
    let id = req.params.id
    if (data[id]) {
        data[id] = req.body
        res.send(req.body)
    }
    else next()
})


// Middleware for error handling with 4 parameters
app.use(function(err, req, res, next){
    res.status(err.status || 500)
    res.send({ error: err.message })
})

//  Catch-all: if no route is matched, this function is called (404)
app.use(function(req, res){
    res.status(404)
    res.send({ error: "not found" })
})

// start the server and listen on port 3000
app.listen(3000)
console.log('Express started on port 3000')

