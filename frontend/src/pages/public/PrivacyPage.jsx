import React from 'react'
import './ContentPage.css'

const PrivacyPage = () => {
  return (
    <div className="content-page">
      <div className="container">
        <div className="content-header">
          <h1>Privacy Policy</h1>
        </div>

        <div className="content-body">
          <section>
            <h2>1. Information We Collect</h2>
            <h3>1.1 Buyer Information</h3>
            <p>When you contact a farmer, we collect:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Location</li>
              <li>Phone number (optional)</li>
            </ul>

            <h3>1.2 Usage Information</h3>
            <p>We automatically collect:</p>
            <ul>
              <li>Product views and browsing behavior</li>
              <li>IP address for rate limiting</li>
              <li>Browser type and device information</li>
              <li>Session data</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use collected information for:</p>
            <ul>
              <li>Facilitating communication between buyers and farmers</li>
              <li>Analytics and improving platform performance</li>
              <li>Government decision-making and reporting</li>
              <li>Preventing abuse and enforcing rate limits</li>
              <li>Autofilling forms for returning users</li>
            </ul>
          </section>

          <section>
            <h2>3. Information Sharing</h2>
            <p>
              When you contact a farmer, your information (name, email, location, phone) is shared with that
              specific farmer to facilitate communication. We do not sell your personal information to third parties.
            </p>
            <p>
              Aggregated, anonymized data may be used for government reporting and analytics purposes.
            </p>
          </section>

          <section>
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information, including:
            </p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure database storage</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies and Tracking</h2>
            <p>
              We use browser localStorage to store:
            </p>
            <ul>
              <li>Language preference</li>
              <li>Theme selection</li>
              <li>Session information</li>
            </ul>
            <p>
              You can clear this data through your browser settings at any time.
            </p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of analytics tracking</li>
            </ul>
          </section>

          <section>
            <h2>7. Children's Privacy</h2>
            <p>
              This platform is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2>8. Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify users of significant changes
              through the platform.
            </p>
          </section>

          <section>
            <h2>9. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at:
            </p>
            <p>
              Email: privacy@rythusampada.com<br />
              Phone: +91 1234567890
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
