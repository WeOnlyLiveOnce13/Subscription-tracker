import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minLength: 2,
        maxLength: 50,
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minLength: 6,
    },

},

// know when the user was created and updated
{timestamps: true}

);

const User = mongoose.model('User', userSchema);

export default User;