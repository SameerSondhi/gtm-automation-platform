// src/pages/Privacy.jsx
import React from 'react';

const Privacy = () => {
  return (
    <section className="p-10 max-w-4xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-primary mb-6 text-center">Privacy Policy</h1>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <p>
          At StackPilot, we value your privacy and are committed to protecting your data. This Privacy Policy outlines the type of information we collect, how we use it, and the measures we take to keep it secure.
        </p>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Data Collection</h2>
          <p>
            We only collect data you provide to us directly — such as your name, email, and organization — during account signup and platform use. We do not collect personally identifiable information without your consent.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Authentication & Storage</h2>
          <p>
            StackPilot uses Supabase Auth for secure user authentication. All user, lead, and activity data is stored securely in Supabase databases, hosted with encryption and best-in-class security practices.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party APIs</h2>
          <p>
            When you choose to enrich leads or connect to third-party tools (like AI enrichment, CRM syncs, etc.), we may pass non-sensitive lead data to third-party services. These providers follow their own privacy policies and do not receive your authentication credentials.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Data Usage</h2>
          <p>
            We use the data you provide only to operate, improve, and support your StackPilot experience. We do not sell your data or share it with advertisers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Security</h2>
          <p>
            We take data security seriously and use SSL encryption, secure storage protocols, and access control policies to protect your information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. Your Control</h2>
          <p>
            You have full control over your account and data. You can delete your account at any time, which will erase all stored records associated with your user ID.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Contact</h2>
          <p>
            For any questions, feel free to reach out to our team at <a href="mailto:stackpilotapp@gmail.com" className="text-primary underline">stackpilotapp@gmail.com</a>.
          </p>
        </div>

        <p className="text-xs text-center mt-8 text-muted">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </section>
  );
};

export default Privacy;