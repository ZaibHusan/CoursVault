import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublishStatus,
  toggleFeatured,
  uploadThumbnail,
  getPublishedCourses,
  getFeaturedCourses,
  getCourseBySlug,
  convertAmount,
} from '../controllers/courseController.js';
import upload from '../middlarwears/uploadMiddleware.js';

const CourseRoute = express.Router();

// ============ PUBLIC ROUTES (No Auth) ============

// Get featured courses (for homepage)
CourseRoute.get('/featured', getFeaturedCourses);

// Get all published courses (catalog)
CourseRoute.get('/catalog/all', getPublishedCourses);

// Get single published course by slug
CourseRoute.get('/catalog/:slug', getCourseBySlug);

// ============ ADMIN ROUTES (Protected) ============

// Create new course
CourseRoute.post('/create', createCourse);

// Get all courses (including drafts)
CourseRoute.get('/all', getAllCourses);

// Upload thumbnail
CourseRoute.post(
  '/upload-thumbnail',
  upload.single('thumbnail'),
  uploadThumbnail
);

// Convert amount - MUST be before /:id
CourseRoute.get('/convert', convertAmount);



// Update course
CourseRoute.put('/update/:id', updateCourse);

// Delete course
CourseRoute.delete('/delete/:id', deleteCourse);

// Toggle publish status
CourseRoute.patch('/publish/:id', togglePublishStatus);

// Toggle featured status
CourseRoute.patch('/featured/:id', toggleFeatured);

// Get single course by ID (admin - full details)
CourseRoute.get('/:id', getCourseById);

export default CourseRoute;