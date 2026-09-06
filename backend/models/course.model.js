import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    duration: {
      type: String,
      trim: true,
      default: ''
    },
    type: {
      type: String,
      enum: ['video', 'pdf', 'quiz'],
      default: 'video'
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    previewUrl: {
      type: String,
      trim: true,
      default: null
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    lectures: [lectureSchema],
    order: {
      type: Number,
      default: 0
    }
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true
    },
    
    // Pricing in USD (International standard)
    priceUSD: {
      type: Number,
      required: true,
      min: 0
    },
    originalPriceUSD: {
      type: Number,
      min: 0
    },
    
    access: {
      type: String,
      default: 'Lifetime Access',
      trim: true
    },
    driveLink: {
      type: String,
      required: true,
      trim: true
    },
    
    curriculum: [moduleSchema],
    
    totalLectures: {
      type: Number,
      default: 0
    },
    
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    studentsEnrolled: {
      type: Number,
      default: 0
    },
    
    isPublished: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug and calculate lectures
courseSchema.pre('save', async function () {
  if (!this.slug && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    const Course = this.constructor;
    
    while (await Course.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  
  if (this.curriculum && this.curriculum.length > 0) {
    this.totalLectures = this.curriculum.reduce((total, module) => 
      total + (module.lectures?.length || 0), 0
    );
  }
});

export default mongoose.model('Course', courseSchema);