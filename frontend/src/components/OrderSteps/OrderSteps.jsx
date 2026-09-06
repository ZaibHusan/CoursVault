import React from 'react';
import './OrderSteps.css';
import { Check, User, CreditCard, CheckCircle2 } from 'lucide-react';

export default function OrderSteps({ currentStep }) {
  const steps = [
    { number: 1, label: 'Details', icon: <User size={16} /> },
    { number: 2, label: 'Payment', icon: <CreditCard size={16} /> },
    { number: 3, label: 'Done', icon: <CheckCircle2 size={16} /> }
  ];

  return (
    <div className="order-steps">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep;
        const isComplete = step.number < currentStep;
        
        return (
          <React.Fragment key={step.number}>
            <div className={`step-item ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}>
              <div className="step-circle">
                {isComplete ? <Check size={14} /> : step.icon}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`step-line ${isComplete ? 'complete' : ''}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}