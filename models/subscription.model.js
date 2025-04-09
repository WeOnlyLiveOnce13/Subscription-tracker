import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100,
    },

    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price must be a positive number']
    },

    currency: {
        type: String,
        enum: ['ZAR','USD', 'EUR', 'GBP'],
        default: 'ZAR'
    },

    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },

    category: {
        type: String,
        enum: ['sports', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other'], 
        required: [true, 'Subscription category is required'],
    },

    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required'],
        trim: true,
    },

    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },


    startDate: {
        type: Date,
        required: [true],
        validate: {
            validator: function (value) {
                return value <= Date.now();
            },
            message: 'Start date must be in the past or present',
        },
    },

    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date',
        },
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true],
        index: true,
    },


},

// know when the subscription was created and updated
{timestamps: true}
);

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriod = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };


        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriod[this.frequency]);
    }
    

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }

    next();
});


const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;