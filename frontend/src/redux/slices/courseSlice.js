import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  featuredCourses: [],
  allCourses: [],
  singleCourse: null,
  isLoadingFeatured: false,
  isLoadingAll: false,
  isLoadingSingle: false,
  currentCurrency: 'USD',
  error: null
};

export const courseSlice = createSlice({
  name: 'publicCourse',
  initialState,
  reducers: {
    // Featured courses
    setFeaturedLoading: (state, action) => {
      state.isLoadingFeatured = action.payload;
    },
    setFeaturedCourses: (state, action) => {
      state.featuredCourses = action.payload || [];
      state.isLoadingFeatured = false;
      state.error = null;
    },
    
    // All courses
    setAllLoading: (state, action) => {
      state.isLoadingAll = action.payload;
    },
    setAllCourses: (state, action) => {
      state.allCourses = action.payload || [];
      state.isLoadingAll = false;
      state.error = null;
    },
    
    // Single course
    setSingleLoading: (state, action) => {
      state.isLoadingSingle = action.payload;
    },
    setSingleCourse: (state, action) => {
      state.singleCourse = action.payload;
      state.isLoadingSingle = false;
      state.error = null;
    },
    clearSingleCourse: (state) => {
      state.singleCourse = null;
      state.error = null;
    },
    
    // Currency
    setCurrency: (state, action) => {
      state.currentCurrency = action.payload;
    },
    
    // Error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoadingFeatured = false;
      state.isLoadingAll = false;
      state.isLoadingSingle = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setFeaturedLoading,
  setFeaturedCourses,
  setAllLoading,
  setAllCourses,
  setSingleLoading,
  setSingleCourse,
  clearSingleCourse,
  setCurrency,
  setError,
  clearError
} = courseSlice.actions;

export default courseSlice.reducer;