// src/pages/Terms.jsx
import React from 'react';

const Terms = () => {
  return (
    <section className="p-10 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Terms of Use</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <p>
          These Terms of Use govern your access to and use of StackPilot, a web-based GTM orchestration platform. By using StackPilot, you agree to comply with these terms.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using StackPilot, you agree to be bound by these Terms of Use. If you do not agree, please discontinue use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Use of Service</h2>
          <p>
            You may not use StackPilot for any unlawful purpose. You agree not to copy, modify, reverse-engineer, exploit, or misuse any part of the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials and any activity that occurs under your account.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Third-Party Integrations</h2>
          <p>
            StackPilot may integrate with third-party APIs. Your use of those services is subject to their individual terms and conditions. We are not responsible for data shared with those services.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Suspension or Termination</h2>
          <p>
            StackPilot reserves the right to suspend or terminate accounts for behavior that violates these terms, causes platform harm, or is deemed abusive, unethical, or malicious.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. No Warranties</h2>
          <p>
            StackPilot is provided “as is” without any warranties of any kind, express or implied. We do not guarantee uninterrupted access, error-free operation, or that the service will meet your expectations.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Limitation of Liability</h2>
          <p>
            StackPilot shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">8. Updates to Terms</h2>
          <p>
            We may update these Terms of Use from time to time. Continued use of StackPilot after changes are published constitutes acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">9. Contact</h2>
          <p>
            Questions? Email us at <a href="mailto:stackpilotapp@gmail.com" className="text-primary underline">stackpilotapp@gmail.com</a>
          </p>
        </div>

        <p className="text-xs text-center mt-8 text-muted">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default Terms;