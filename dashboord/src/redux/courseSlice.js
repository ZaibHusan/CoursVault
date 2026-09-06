import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  singleCourse: null,
  isLoading: false,
  error: null
};

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setCourses: (state, action) => {
      state.courses = action.payload || [];
      state.isLoading = false;
      state.error = null;
    },
    
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
      state.error = null;
    },
    
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(c => c._id === action.payload._id);
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload };
      }
    },
    
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(c => c._id !== action.payload);
    },
    
    setSingleCourse: (state, action) => {
      state.singleCourse = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    clearSingleCourse: (state) => {
      state.singleCourse = null;
      state.error = null;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setLoading, 
  setCourses,
  addCourse,
  updateCourse,
  removeCourse,
  setSingleCourse, 
  clearSingleCourse, 
  setError, 
  clearError
} = courseSlice.actions;

export default courseSlice.reducer;