import { useSelector, useDispatch } from "react-redux";
import {
  setFeaturedLoading,
  setFeaturedCourses,
  setAllLoading,
  setAllCourses,
  setSingleLoading,
  setSingleCourse,
  clearSingleCourse,
  setError,
  clearError
} from "../redux/slices/courseSlice";
import api from "../../api/api.js";

export const useCourses = () => {
  const dispatch = useDispatch();
  const {
    featuredCourses,
    allCourses,
    singleCourse,
    isLoadingFeatured,
    isLoadingAll,
    isLoadingSingle,
    error
  } = useSelector((state) => state.publicCourse);

  // Get currency immediately from localStorage
  const getCurrency = () => {
    return localStorage.getItem('userCurrency') || 'USD';
  };

  // Fetch featured courses
  const fetchFeaturedCourses = async (currency) => {
    const userCurrency = currency || getCurrency();
    dispatch(setFeaturedLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/courses/featured?currency=${userCurrency}`);
      
      if (response.data?.success) {
        dispatch(setFeaturedCourses(response.data.courses));
        return { success: true, courses: response.data.courses };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch featured courses';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Fetch all published courses
  const fetchAllCourses = async (currency) => {
    const userCurrency = currency || getCurrency();
    dispatch(setAllLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/courses/catalog/all?currency=${userCurrency}`);
      
      if (response.data?.success) {
        dispatch(setAllCourses(response.data.courses));
        return { success: true, courses: response.data.courses };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch courses';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  // Fetch single course by slug
  const fetchCourseBySlug = async (slug, currency) => {
    if (!slug) {
      dispatch(setError('Invalid course slug'));
      return { success: false, message: 'Invalid course slug' };
    }

    const userCurrency = currency || getCurrency();
    dispatch(setSingleLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/courses/catalog/${slug}?currency=${userCurrency}`);
      
      if (response.data?.success) {
        dispatch(setSingleCourse(response.data.course));
        return { success: true, course: response.data.course };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch course';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  return {
    featuredCourses,
    allCourses,
    singleCourse,
    isLoadingFeatured,
    isLoadingAll,
    isLoadingSingle,
    error,
    fetchFeaturedCourses,
    fetchAllCourses,
    fetchCourseBySlug,
    clearCourse: () => dispatch(clearSingleCourse()),
    dismissError: () => dispatch(clearError())
  };
};