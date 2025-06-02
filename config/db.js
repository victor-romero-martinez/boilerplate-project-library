const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Successfully connection to MongoDB')
    } catch (error) {
        console.error('Error connection to MongoDB:', error?.message)
        process.exit(1)
    }
}

module.exports = connectDB