import React from 'react'
import './ContentPage.css'

const TermsPage = () => {
  return (
    <div className="content-page">
      <div className="container">
        <div className="content-header">
          <h1>Terms & Conditions</h1>
        </div>

        <div className="content-body">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using the Rythu Sampada portal, you accept and agree to be bound by the
              terms and provision of this agreement. If you do not agree to these terms, please do not use this platform.
            </p>
          </section>

          <section>
            <h2>2. Platform Purpose</h2>
            <p>
              Rythu Sampada is a government-supported platform designed to connect consumers with local
              farmers. This platform facilitates communication only and does not process payments or
              handle transactions directly.
            </p>
          </section>

          <section>
            <h2>3. User Responsibilities</h2>
            <h3>3.1 Buyers</h3>
            <ul>
              <li>Provide accurate information when contacting farmers</li>
              <li>Respect rate limits (10 farmer contacts per hour)</li>
              <li>Communicate respectfully with farmers</li>
              <li>Understand that transactions occur directly with farmers</li>
            </ul>

            <h3>3.2 Farmers</h3>
            <ul>
              <li>Provide accurate product information and images</li>
              <li>Respond to buyer inquiries in a timely manner</li>
              <li>Maintain quality and freshness of farm products</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2>4. Product Listings</h2>
            <p>
              All products listed on this platform are subject to approval by administrators. We reserve the right
              to remove any listing that violates our guidelines or misrepresents farm products.
            </p>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              All content on this platform, including text, graphics, logos, and images, is the property of
              Rythu Sampada or its content suppliers and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              Rythu Sampada serves as a communication platform only. We are not responsible for:
            </p>
            <ul>
              <li>Quality, freshness, or condition of farm products</li>
              <li>Transactions between buyers and farmers</li>
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
              Email: elururythusampada@gmail.com<br />
              Phone: +91 8331056671
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
