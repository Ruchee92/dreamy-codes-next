"use client";

import React, { useEffect } from 'react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12">Terms of Service</h1>
      <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed">
        <p className="mb-6">Last Updated: March 15, 2026</p>
        
        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">1. Acceptance of Terms</h2>
        <p className="mb-6">
          By accessing or using the services provided by Dreamy Codes, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">2. Services</h2>
        <p className="mb-6">
          Dreamy Codes provides Shopify design, development, and conversion optimization services. The specific scope of work for any project will be defined in a separate agreement or statement of work.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">3. Intellectual Property</h2>
        <p className="mb-6">
          Unless otherwise agreed in writing, all custom code and designs created specifically for a client will become the property of the client upon full payment. Dreamy Codes retains ownership of its proprietary tools, frameworks, and pre-existing code.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">4. Payment Terms</h2>
        <p className="mb-6">
          Payment terms are defined on a per-project basis. Typically, a deposit is required before work begins, with the balance due upon project completion or at defined milestones.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">5. Limitation of Liability</h2>
        <p className="mb-6">
          Dreamy Codes shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services or for the cost of procurement of substitute services.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">6. Governing Law</h2>
        <p className="mb-6">
          These terms shall be governed by and construed in accordance with the laws of Sri Lanka, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
