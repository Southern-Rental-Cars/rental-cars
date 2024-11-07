'use client';

import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-lg my-8">
      <h1 className="text-2xl font-semibold mb-1">Privacy Policy</h1>
      <p className='text-gray-500 text-sm mb-4'> Last Updated: 10-28-24 </p>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Personal information we collect</h2>
        <p>
          We collect personal information you provide, and personal information automatically collected from your use of the Services.
        </p>
        <h3 className="text-md font-semibold mt-4">Account data</h3>
        <p>
          When you register for an account with us, we require certain personal information to open your account, such as your name, email address, a password, personal information such as license, billing, phone number, and date of birth.
          Your personal information is encrypted in our database. Information such as: password, date of birth, license and billing.
        </p>

        <h3 className="text-md font-semibold mt-4">Profile data</h3>
        <p>
          We may also ask you to provide additional profile information to use certain features of the services which may include street addresses, phone numbers, driver’s license number, date of issuance and issuing country and/or state, profile photos, and date of birth. Certain parts of your profile (like your profile photos, employer, city, school, and biography) are part of your public profile page and will be publicly visible to others.
        </p>
        <h3 className="text-md font-semibold mt-4">Cookies</h3>
        <p>
          The only time cookies are stored on your device is when you log in to our site. These cookies store an authentication token to allow persistence of your logged-in state and authentication to access company data. Once you log out, these cookies are deleted.
        </p>
        <h3 className="text-md font-semibold mt-4">Payment data</h3>
        <p>
          We collect your digital payment details, bank account or payment card numbers, and transaction information in connection with a potential or actual transaction, which may be processed and stored by one or more third-party payment service providers or digital payments companies.
          Your payment method information is not directly stored in our database. Instead, it is securely transmitted to PayPal, our payment processor. PayPal provides us with a secure key to access your payment information when needed.
        </p>

        <h3 className="text-md font-semibold mt-4">Identity verification data</h3>
        <p>
          In some instances, we may collect identity verification information such as a photograph or scanned copy of a driver’s license, passport, national ID card, or payment card, last four digits of your Social Security number, social insurance number, social media account information, driver’s/motor vehicle record, insurance information, or other forms of identification information. Where we request that you withhold certain information (such as obscuring or redacting aspects of identification information), please do so.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How we use your personal information</h2>
        <p>
          We use, store, and process your personal information to provide and improve the Services and for security and safety purposes. For example, we may use your information:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>To provide and operate the services</li>
          <li>To provide customer support</li>
          <li>To send you service, support, and administrative messages, reminders, technical notices, updates, security alerts, and information requested by you at any telephone number, by placing a voice call or through text (SMS) or email messaging</li>
          <li>To facilitate your login to the Services via third-party identity and access management providers, such as Google and Apple</li>
          <li>To process transactions and send notices about your transactions</li>
          <li>To personalize or customize your user experience</li>
          <li>To send your requests for reviews, for fraud detection and prevention, and for any purpose you authorize at the time of collection</li>
          <li>To administer referral programs, rewards, surveys, contests, or other promotional activities or sponsored events in which you participate</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Marketing and advertising:</h2>
        <h3 className="text-md font-semibold mt-4">Direct marketing</h3>
        <p>
          We may send you marketing communications as permitted by law. You will have the ability to opt-out of our marketing and promotional communications.
        </p>

        <h3 className="text-md font-semibold mt-4">For security and safety</h3>
        <p>
          We use your personal information for security and safety purposes, including to:
        </p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Verify your identity or authenticate information that you provide, including during account creation and password reset processes</li>
          <li>Resolve disputes, collect fees, and troubleshoot problems</li>
          <li>Detect, prevent, and/or remediate fraud, abuse, security incidents, or other potentially harmful, prohibited, or illegal activities</li>
          <li>Manage and protect our information technology infrastructure</li>
          <li>Conduct investigations and risk assessments</li>
          <li>Conduct checks against databases and information sources (such as but not limited to public government databases)</li>
          <li>Perform creditworthiness and solvency checks</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">To comply with law</h2>
        <p>
          We use your personal information as necessary or appropriate to comply with applicable laws, lawful requests, and legal processes, such as to respond to subpoenas or requests from government authorities.
        </p>

        <h3 className="text-md font-semibold mt-4">With your consent</h3>
        <p>
          In some cases, we may specifically ask for your consent to process your personal information. We may also use your personal information as described elsewhere in this Privacy Policy or as disclosed to you at the time of collection.
        </p>
      </section>
    </div>
  );
}