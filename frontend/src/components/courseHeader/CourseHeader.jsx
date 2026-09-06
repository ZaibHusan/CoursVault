import React from 'react';
import OfferBanner from '../OfferBanner/OfferBanner';
import './CourseHeader.css';

export default function CourseHeader() {
  return (
    <div className="course-header-container">
      {/* Only Offer Banner - No redundant title section */}
      <OfferBanner />
    </div>
  );
}