const functions = require("firebase-functions");
const cors = require('cors')({origin: true});
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

require('dotenv').config();

const nodemailer = require('nodemailer');

const {SENDER_EMAIL,SENDER_PASSWORD} = process.env;


const transporter = nodemailer.createTransport({
        
    host:'smtp.gmail.com',
    port: 465,
    secure:true,
    auth:{
    user: SENDER_EMAIL,
    pass: SENDER_PASSWORD
    }

});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.email = functions.https.onRequest((request, response) => {
    cors(request, response, () =>{

        var data = request.body
        var id = data.id
        var items = data.items
        var name = data.name
        var email = data.email
        var price = data.price

        // if( id != 155 ){
        // //Sent over id, name, items, email and price
    
        //     let Today = new Date()
            
        //     const mailOptions = {
        //         from:'Duncan Grille',
        //         to: email ,
        //         subject:`Order Complete: ${Today.getMonth() + 1}/${Today.getDate()}`,
        //         text:` Hello ${name},\n\n
        //         Your Order for ${items} is complete!\n\n
        //         CBR,\n
        //         The Duncan Grille Staff`,
        //         html:`Hello ${name},<br><br>
        //         Your order for <b>${items}</b> is complete!<br>
        //         Please <b>venmo @DuncanGrille $${Number(price).toFixed(2)}</b> if you have not done so already.<br><br>
        //         CBR,<br>
        //         The Duncan Grille Staff<br>`,
        //     }
    
        //     return transporter.sendMail(mailOptions, (error,info) =>{
        //         if(error){
        //             return response.status(500).send({
        //                 data:{
        //                     status: 500,
        //                     message: error.toString()
        //                 }
        //             })
        //         }
        //     })

        //     return response.status(2200).send({
        //         data:{
        //             status: 200,
        //             message: 'sent'
        //         }
        //     })

        // }


        functions.logger.log(id,items,name);
    })

});
