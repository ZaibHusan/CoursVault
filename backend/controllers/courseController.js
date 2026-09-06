import Course from '../models/course.model.js';
import { convertPrice, formatPrice, getCurrencySymbol, isValidCurrency } from '../utils/currencyHelper.js';

// Helper: Generate unique slug
const generateCleanSlug = async (title) => {
  const baseSlug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let slug = baseSlug;
  let counter = 1;
  while (await Course.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

// Helper: Sanitize curriculum
const sanitizeCurriculum = (curriculum) => {
  if (!curriculum || !Array.isArray(curriculum)) return [];
  return curriculum.map((module, moduleIndex) => ({
    title: module.title?.trim() || `Module ${moduleIndex + 1}`,
    order: moduleIndex,
    lectures: (module.lectures || module.lessons || []).map((lecture, lectureIndex) => ({
      title: lecture.title?.trim() || `Lecture ${lectureIndex + 1}`,
      duration: lecture.duration?.trim() || '',
      type: lecture.type || 'video',
      isPreview: lecture.isPreview || false,
      previewUrl: lecture.previewUrl || lecture.videoUrl || lecture.contentUrl || null,
      order: lectureIndex
    }))
  }));
};

// Helper: Format course with currency
const formatCourseWithCurrency = (course, currency = 'USD') => {
  const courseObj = course.toObject ? course.toObject() : course;
  const basePrice = courseObj.priceUSD || 0;
  const baseOriginalPrice = courseObj.originalPriceUSD || 0;
  
  return {
    ...courseObj,
    priceUSD: basePrice,
    originalPriceUSD: baseOriginalPrice,
    price: convertPrice(basePrice, currency),
    originalPrice: convertPrice(baseOriginalPrice, currency),
    currency,
    currencySymbol: getCurrencySymbol(currency),
    formattedPrice: formatPrice(basePrice, currency),
    formattedOriginalPrice: formatPrice(baseOriginalPrice, currency)
  };
};

// Helper: Get currency from request
const getRequestCurrency = (req) => {
  const { currency } = req.query;
  if (currency && isValidCurrency(currency)) return currency;
  return 'USD';
};

// ============ ADMIN CONTROLLERS ============

export const createCourse = async (req, res) => {
  try {
    const {
      title, shortDescription, thumbnail, price, originalPrice,
      access, driveLink, curriculum, rating, studentsEnrolled, isFeatured
    } = req.body;

    if (!title || !shortDescription || !thumbnail || price === undefined || !driveLink) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ success: false, message: 'Price must be valid' });
    }

    const slug = await generateCleanSlug(title);
    const sanitizedCurriculum = sanitizeCurriculum(curriculum);
    const totalLectures = sanitizedCurriculum.reduce((total, mod) => total + (mod.lectures?.length || 0), 0);

    const newCourse = await Course.create({
      title: title.trim(),
      slug,
      shortDescription: shortDescription.trim(),
      thumbnail: thumbnail.trim(),
      priceUSD: parsedPrice,
      originalPriceUSD: originalPrice ? Number(originalPrice) : undefined,
      access: access?.trim() || 'Lifetime Access',
      driveLink: driveLink.trim(),
      curriculum: sanitizedCurriculum,
      totalLectures,
      rating: rating || 4.5,
      studentsEnrolled: studentsEnrolled || 0,
      isFeatured: isFeatured || false,
      isPublished: false
    });

    return res.status(201).json({ success: true, message: 'Course created', course: newCourse });
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().select('-driveLink').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error('Get all courses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    return res.status(200).json({ success: true, course });
  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch course' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.slug;

    if (updateData.curriculum) {
      updateData.curriculum = sanitizeCurriculum(updateData.curriculum);
      updateData.totalLectures = updateData.curriculum.reduce((total, mod) => total + (mod.lectures?.length || 0), 0);
    }

    if (updateData.price !== undefined) {
      updateData.priceUSD = Number(updateData.price);
      delete updateData.price;
    }
    if (updateData.originalPrice !== undefined) {
      updateData.originalPriceUSD = Number(updateData.originalPrice);
      delete updateData.originalPrice;
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    if (!updatedCourse) return res.status(404).json({ success: false, message: 'Course not found' });

    return res.status(200).json({ success: true, message: 'Course updated', course: updatedCourse });
  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ success: false, message: 'Course not found' });
    return res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete course' });
  }
};

export const togglePublishStatus = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.isPublished = !course.isPublished;
    await course.save();
    return res.status(200).json({ success: true, isPublished: course.isPublished });
  } catch (error) {
    console.error('Toggle publish error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle' });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    course.isFeatured = !course.isFeatured;
    await course.save();
    return res.status(200).json({ success: true, isFeatured: course.isFeatured });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return res.status(500).json({ success: false, message: 'Failed to toggle' });
  }
};

export const uploadThumbnail = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });
    return res.status(200).json({ success: true, thumbnailUrl: req.file.path });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// ============ PUBLIC CONTROLLERS ============

export const getPublishedCourses = async (req, res) => {
  try {
    const currency = getRequestCurrency(req);
    const courses = await Course.find({ isPublished: true }).select('-driveLink').sort({ isFeatured: -1, createdAt: -1 });
    const formattedCourses = courses.map(course => formatCourseWithCurrency(course, currency));

    return res.status(200).json({
      success: true,
      currency,
      count: formattedCourses.length,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};

export const getFeaturedCourses = async (req, res) => {
  try {
    const currency = getRequestCurrency(req);
    const courses = await Course.find({ isPublished: true, isFeatured: true }).select('-driveLink').sort({ createdAt: -1 }).limit(6);
    const formattedCourses = courses.map(course => formatCourseWithCurrency(course, currency));

    return res.status(200).json({
      success: true,
      currency,
      count: formattedCourses.length,
      courses: formattedCourses
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const currency = getRequestCurrency(req);
    const course = await Course.findOne({ slug, isPublished: true }).select('-driveLink');

    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    const formattedCourse = formatCourseWithCurrency(course, currency);

    return res.status(200).json({
      success: true,
      currency,
      course: formattedCourse
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Failed' });
  }
};




// Convert amount from USD to target currency
export const convertAmount = async (req, res) => {
  try {
    const { amount, currency } = req.query;
    
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    
    if (!currency || !isValidCurrency(currency)) {
      return res.status(400).json({ success: false, message: 'Invalid currency' });
    }
    
    const usdAmount = Number(amount);
    const convertedAmount = convertPrice(usdAmount, currency);
    
    return res.status(200).json({
      success: true,
      originalAmount: usdAmount,
      convertedAmount,
      currency,
      currencySymbol: getCurrencySymbol(currency),
      formattedAmount: formatPrice(usdAmount, currency)
    });
  } catch (error) {
    console.error('Convert amount error:', error);
    return res.status(500).json({ success: false, message: 'Conversion failed' });
  }
};