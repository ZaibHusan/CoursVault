import { useSelector, useDispatch } from "react-redux";
import { 
  setLoading, 
  setCourses,
  addCourse,
  updateCourse as updateCourseInStore,
  removeCourse,
  setSingleCourse, 
  clearSingleCourse, 
  setError,
  clearError 
} from "../redux/courseSlice";
import api from "../api/api";

export const useCourses = () => {
  const dispatch = useDispatch();
  const { courses, singleCourse, isLoading, error } = useSelector(
    (state) => state.course
  );

  const extractId = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return id;
    if (typeof id === 'object') return id._id || id.id || null;
    return String(id);
  };

  const fetchCourses = async () => {
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get('/courses/all');
      if (response.data?.success) {
        dispatch(setCourses(response.data.courses));
        return { success: true };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch courses';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  const fetchCourse = async (id) => {
    const courseId = extractId(id);
    if (!courseId) {
      dispatch(setError('Invalid course ID'));
      return { success: false, message: 'Invalid course ID' };
    }
    
    dispatch(setLoading(true));
    dispatch(clearError());
    
    try {
      const response = await api.get(`/courses/${courseId}`);
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

  const createCourse = async (data) => {
    dispatch(clearError());
    
    try {
      const response = await api.post('/courses/create', data);
      if (response.data?.success) {
        dispatch(addCourse(response.data.course));
        return { success: true, course: response.data.course };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create course';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  const updateCourse = async (id, data) => {
    const courseId = extractId(id);
    
    if (!courseId) {
      dispatch(setError('Invalid course ID'));
      return { success: false, message: 'Invalid course ID' };
    }
    
    dispatch(clearError());
    
    try {
      const response = await api.put(`/courses/update/${courseId}`, data);
      
      if (response.data?.success) {
        dispatch(updateCourseInStore(response.data.course));
        dispatch(setSingleCourse(response.data.course));
        return { success: true, course: response.data.course };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update course';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  const deleteCourse = async (id) => {
    const courseId = extractId(id);
    if (!courseId) {
      dispatch(setError('Invalid course ID'));
      return { success: false, message: 'Invalid course ID' };
    }
    
    dispatch(clearError());
    
    try {
      const response = await api.delete(`/courses/delete/${courseId}`);
      if (response.data?.success) {
        dispatch(removeCourse(courseId));
        if (singleCourse?._id === courseId) {
          dispatch(clearSingleCourse());
        }
        return { success: true };
      }
      throw new Error('Invalid response');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete course';
      dispatch(setError(message));
      return { success: false, message };
    }
  };

  const togglePublish = async (id) => {
    const courseId = extractId(id);
    
    try {
      const response = await api.patch(`/courses/publish/${courseId}`);
      if (response.data?.success) {
        dispatch(updateCourseInStore({ _id: courseId, isPublished: response.data.isPublished }));
        return { success: true };
      }
      throw new Error('Invalid response');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to toggle'));
      return { success: false };
    }
  };

  const toggleFeatured = async (id) => {
    const courseId = extractId(id);
    
    try {
      const response = await api.patch(`/courses/featured/${courseId}`);
      if (response.data?.success) {
        dispatch(updateCourseInStore({ _id: courseId, isFeatured: response.data.isFeatured }));
        return { success: true };
      }
      throw new Error('Invalid response');
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to toggle'));
      return { success: false };
    }
  };

  const uploadThumbnail = async (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    
    try {
      const response = await api.post('/courses/upload-thumbnail', formData);
      if (response.data?.success) {
        return { success: true, url: response.data.thumbnailUrl };
      }
      throw new Error('Invalid response');
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Upload failed' };
    }
  };

  return {
    courses,
    singleCourse,
    isLoading,
    error,
    fetchCourses,
    fetchCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    togglePublish,
    toggleFeatured,
    uploadThumbnail,
    clearCourse: () => dispatch(clearSingleCourse()),
    dismissError: () => dispatch(clearError())
  };
};