const cloudinary = require('cloudinary').v2

const cloud = cloudinary.config({
    cloud_name : 'dffslbdai',
    api_key : 551793992483191,
    api_secret : 'aaUv8_QbbMupVfVkAiU6RCFBUEY'

})

module.exports = cloudinary