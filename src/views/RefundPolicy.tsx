"use client";

import React, { useEffect } from 'react';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12">Refund Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed">
        <p className="mb-6">Last Updated: March 15, 2026</p>
        
        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">1. Service-Based Nature</h2>
        <p className="mb-6">
          Due to the custom, service-based nature of our work, Dreamy Codes generally does not offer full refunds once work has commenced. Our time and expertise are the primary components of our services.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">2. Deposits</h2>
        <p className="mb-6">
          Deposits paid to secure a project start date are non-refundable as they represent a commitment of our resources and the turning away of other potential projects.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">3. Milestone Payments</h2>
        <p className="mb-6">
          Payments made upon the completion of project milestones are non-refundable, as they represent the client's acceptance of the work delivered up to that point.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">4. Dissatisfaction</h2>
        <p className="mb-6">
          If you are dissatisfied with the work being performed, please notify us immediately. We are committed to achieving high-quality results and will work with you to address concerns through our defined revision process.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">5. Project Cancellation</h2>
        <p className="mb-6">
          If a project is cancelled by the client before completion, the client will be responsible for payment for all work performed up to the date of cancellation.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
