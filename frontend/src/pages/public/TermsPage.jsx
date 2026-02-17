import React from 'react'
import './ContentPage.css'

const TermsPage = () => {
  return (
    <div className="content-page">
      <div className="container">
        <div className="content-header">
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last updated: February 15, 2026</p>
        </div>

        <div className="content-body">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Swayam Eluru Market Place portal, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to these terms, please do not use this platform.
            </p>
          </section>

          <section>
            <h2>2. Platform Purpose</h2>
            <p>
              Swayam Eluru Market Place is a government-supported platform designed to connect buyers with SHG
              artisans and vendors. This platform facilitates communication only and does not process payments or
              handle transactions directly.
            </p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <h3>3.1 Buyers</h3>
            <ul>
              <li>Provide accurate information when contacting vendors</li>
              <li>Respect rate limits (10 vendor contacts per hour)</li>
              <li>Communicate respectfully with artisans and vendors</li>
              <li>Understand that transactions occur directly with vendors</li>
            </ul>

            <h3>3.2 Vendors</h3>
            <ul>
              <li>Provide accurate product information and images</li>
              <li>Respond to buyer inquiries in a timely manner</li>
              <li>Maintain authenticity of SHG products</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2>4. Product Listings</h2>
            <p>
              All products listed on this platform are subject to approval by administrators. We reserve the right
              to remove any listing that violates our guidelines or misrepresents SHG craftsmanship.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              All content on this platform, including text, graphics, logos, and images, is the property of
              Swayam Eluru Market Place or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              Swayam Eluru Market Place serves as a communication platform only. We are not responsible for:
            </p>
            <ul>
              <li>Quality, authenticity, or condition of products</li>
              <li>Transactions between buyers and vendors</li>
              <li>Disputes arising from direct communications</li>
              <li>Delivery, payment, or fulfillment issues</li>
            </ul>
          </section>

          <section>
            <h2>7. Privacy</h2>
            <p>
              Your use of this platform is also governed by our Privacy Policy. Please review our Privacy Policy
              to understand our practices.
            </p>
          </section>

          <section>
            <h2>8. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the platform after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>
              For questions about these Terms & Conditions, please contact us at:
            </p>
            <p>
              Email: legal@swayameluru.com<br />
              Phone: +91 1234567890
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
