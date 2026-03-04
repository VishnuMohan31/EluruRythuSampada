import React from 'react'
import './ContentPage.css'

const DisclaimerPage = () => {
  return (
    <div className="content-page">
      <div className="container">
        <div className="content-header">
          <h1>Disclaimer</h1>
        </div>

        <div className="content-body">
          <section>
            <h2>1. Platform Purpose</h2>
            <p>
              Rythu Sampada is a communication platform that connects consumers with local farmers. We do not 
              process payments, handle transactions, or act as an intermediary in sales.
            </p>
          </section>

          <section>
            <h2>2. No Warranty</h2>
            <p>
              This platform is provided "as is" without any warranties, express or implied. We make no guarantees
              regarding:
            </p>
            <ul>
              <li>Product quality, freshness, or condition</li>
              <li>Farmer reliability or responsiveness</li>
              <li>Accuracy of product descriptions or images</li>
              <li>Availability of products</li>
              <li>Successful completion of transactions</li>
            </ul>
          </section>

          <section>
            <h2>3. Third-Party Transactions</h2>
            <p>
              All transactions occur directly between buyers and farmers. Rythu Sampada is not a party
              to these transactions and bears no responsibility for:
            </p>
            <ul>
              <li>Payment processing or disputes</li>
              <li>Product delivery or shipping</li>
              <li>Product returns or refunds</li>
              <li>Quality issues or defects</li>
              <li>Farmer conduct or communication</li>
            </ul>
          </section>

          <section>
            <h2>4. Product Information</h2>
            <p>
              Product information, descriptions, and images are provided by farmers. While we strive to ensure
              accuracy, we cannot guarantee that all information is complete, current, or error-free.
            </p>
          </section>

          <section>
            <h2>5. External Links</h2>
            <p>
              This platform may contain links to external websites (YouTube, Instagram, etc.). We are not
              responsible for the content, privacy practices, or availability of external sites.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Rythu Sampada and the Government shall not be liable 
              for any direct, indirect, incidental, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Use or inability to use the platform</li>
              <li>Transactions with farmers</li>
              <li>Product quality or freshness issues</li>
              <li>Loss of data or information</li>
              <li>Unauthorized access to your information</li>
            </ul>
          </section>

          <section>
            <h2>7. User Responsibility</h2>
            <p>
              Users are responsible for:
            </p>
            <ul>
              <li>Verifying product details with farmers</li>
              <li>Conducting due diligence before transactions</li>
              <li>Negotiating terms directly with farmers</li>
              <li>Resolving disputes independently</li>
              <li>Complying with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2>8. Government Initiative</h2>
            <p>
              While this is a government-supported initiative, it does not constitute an endorsement of any
              specific farmer or product. The government's role is to provide a platform for farmers,
              not to guarantee transactions.
            </p>
          </section>

          <section>
            <h2>9. Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time. Continued use of the platform after
              changes constitutes acceptance of the modified disclaimer.
            </p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>
              For questions about this disclaimer, contact us at:
            </p>
            <p>
              Email: info@rythusampada.com<br />
              Phone: +91 1234567890
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DisclaimerPage
