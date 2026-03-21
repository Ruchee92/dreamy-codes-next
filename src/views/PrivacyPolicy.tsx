"use client";

import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed">
        <p className="mb-6">Last Updated: March 15, 2026</p>
        
        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">1. Introduction</h2>
        <p className="mb-6">
          Dreamy Codes ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">2. Information We Collect</h2>
        <p className="mb-4">We collect information that you provide directly to us, including:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Name and contact information (email address, phone number)</li>
          <li>Business information (store URL, company name)</li>
          <li>Project details and communications</li>
          <li>Payment information (processed securely via third-party providers)</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">3. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Communicate with you about projects and inquiries</li>
          <li>Send technical notices, updates, and security alerts</li>
          <li>Respond to your comments and questions</li>
        </ul>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">4. Data Security</h2>
        <p className="mb-6">
          We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="font-display text-2xl font-bold text-brand-900 uppercase mt-12 mb-6">5. Contact Us</h2>
        <p className="mb-6">
          If you have any questions about this Privacy Policy, please contact us at hello@dreamycodes.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
