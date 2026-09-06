import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    courseTitle: {
      type: String,
      required: true
    },
    
    // Base amount in USD
    coursePriceUSD: {
      type: Number,
      required: true
    },
    
    // User's currency and amount paid
    currency: {
      type: String,
      enum: ['USD', 'INR', 'PKR'],
      default: 'USD'
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    
    userInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
      },
      phone: {
        type: String,
        trim: true,
        default: ''
      },
      note: {
        type: String,
        trim: true,
        default: ''
      }
    },
    
    paymentProof: {
      screenshotUrl: {
        type: String,
        default: null
      },
      uploadedAt: {
        type: Date,
        default: null
      }
    },
    
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending'
    },
    
    timeline: [
      {
        status: String,
        note: String,
        at: {
          type: Date,
          default: Date.now
        }
      }
    ],
    
    adminNote: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Order', orderSchema);