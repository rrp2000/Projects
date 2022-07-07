const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");


//--------------------------------- AUTHENTICATION MIDDLEWARE ------------------------------------------------------------------------

const authentication = function (req, res, next) {
  try {
    let token = req.headers["X-Api-Key"];         //Getting token from header
    if (!token) token = req.headers["x-api-key"];     //checking token with Uppercase
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });    //If neither condition satisfies & no token is present in the request header return error


    let decodedToken = jwt.verify(token, "group63")
    // res.send(decodedToken)
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });

    // if(decodedToken.exp<Math.floor(Date.now() / 1000)){
    //   res.status(400).send({ status: false, msg: "Token expired, please login again" })
    // }
    // console.log(decodedToken.exp<Math.floor(Date.now() / 1000))

    req.loggedInUserId = decodedToken._id
    next() 
  }
             //if token is present next() will call the respective API            

 catch (error) {
  return res.status(500).send({ status: false, Error: error.message })
}
};





//--------------------------------- AUTHORISATION MIDDLEWARE ----------------------------------------------------------------------------------

// const authorisation = async function (req, res, next) {

//   try {

//     let userToBeModified = req.body.userId
//     console.log(userToBeModified)

//     let book = await bookModel.findById({ _id: userToBeModified })    //id in bookModel is same as getting from req.params or not
//     //let userLoggedIn = decodedToken._id
//     console.log(book)
//     console.log(req.loggedInUserId)
//     if (book.userId != req.loggedInUserId) {    //We have stored decoded token into req.loggedInuserId and comparing it with blog.authorId
//       return res.status(403).send({ status: false, msg: 'user logged is not allowed to modify the requested data' })
//     }
//     next()
//   } catch (err) {
//     return res.status(500).send({ status: false, msg: err.message })
//   }


// }


module.exports.authentication = authentication
// module.exports.authorisation = authorisation