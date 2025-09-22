import React, { useState } from "react";
import { ChevronDown, ChevronUp, CornerDownRight } from "lucide-react";

const faqs = [
  {
    question: "How do I log in?",
    answer: "Click Log in, enter your email and password, then Sign in.",
  },
  {
    question: "I forgot my password, what now?",
    answer: "Click Forgot password, enter your account email, and we’ll send a one-time password (OTP) to that email. Enter the OTP on the reset screen to set a new password. OTPs expire, request a new one if needed.",
  },
  {
    question: "How is account verification handled?",
    answer: "After registering you’ll receive an OTP by email only. Enter the OTP on the verification screen to confirm your account. We do not use SMS for verification.",
  },
  {
    question: "I didn't receive the OTP email for password reset or verification.",
    answer: "Check Spam/promotions and confirm the email address you entered. If it’s not there, request a new OTP. If problems persist, contact support (contactus@bidinsight.com).",
  },
  {
    question: "Can I use single sign-on (SSO) or social login?",
    answer: "Yes, if your organization has SSO enabled you’ll see that option. Note: password resets and account verification for standard email accounts use email OTP only.",
  },
  {
    question: "Is multi-factor authentication (MFA) supported?",
    answer: "Yes, enable MFA in Account Settings for extra security. Primary verification and password resets remain email-OTP only; MFA can use authenticator apps where available.",
  },
  {
    question: "How do I create an account?",
    answer: "Click Register / Sign up, enter your email and password (or choose a social sign-up). You’ll receive an OTP via email to verify the address, enter it to complete registration.",
  },
  {
    question: "What fields are required during registration?",
    answer: "Typically: email, password, and acceptance of Terms & Privacy. Optional fields (name, company, phone) can be filled later in your profile.",
  },
  {
    question: "Can I use a work email or personal email?",
    answer: "Either, use whichever you want associated with the account.",
  },
  {
    question: "Is there an invite flow for teams?",
    answer: "Yes, if your organization sends an invite link, accepting it will link your account to that organization. Invite acceptance may require email OTP verification.",
  },
  {
    question: "What personal details do you collect and why?",
    answer: "Common items: full name, job title, time zone, language preference, and contact email. These are used to personalize your experience, manage notifications, and for billing where needed.",
  },
  {
    question: "Can I edit my personal details later?",
    answer: "Yes, go to Account > Profile to update name, email, title, timezone and contact info.",
  },
  {
    question: "How do you protect my personal info?",
    answer: "We follow best practices (secure storage, encrypted communications). Sensitive payment data is handled by Stripe, we never store raw card numbers.",
  },
  {
    question: "What should I put in the company profile?",
    answer: "Company name, address, website, number of employees and billing contact. This helps with invoices and team setup.",
  },
  {
    question: "What are geographic preferences?",
    answer: "Settings for allowed regions, time zone and content localization (language and region-specific recommendations).",
  },
  {
    question: "Why do you ask for location?",
    answer: "To localize content, respect regional restrictions and apply correct taxes and currency for billing.",
  },
  {
    question: "Can I change geographic preferences later?",
    answer: "Yes, update time zone or region in Account settings. If changing billing country, contact support to ensure invoices/taxes are correct.",
  },
  {
    question: "Why do you ask about my industry?",
    answer: "Industry info helps personalize recommendations, templates and AI outputs to be more relevant to your business.",
  },
  {
    question: "Can I select multiple industries?",
    answer: "Yes, choose a primary industry plus any secondary ones relevant to your work based on your plan.",
  },
  {
    question: "What does “Personalize AI” mean?",
    answer: "It means providing contextual info (role, company profile, tone, product details) so AI suggestions match your business and voice.",
  },
  {
    question: "Which details make the biggest difference for AI personalization?",
    answer: "Company summary, product descriptions, target audience and preferred tone (formal/casual) have the biggest impact.",
  },
  {
    question: "How do I provide details to personalize AI?",
    answer: "During onboarding you’ll see fields and optional uploads (docs, website URL, brand guidelines). You can also import or edit them later in AI Settings.",
  },
  {
    question: "Can I remove or update the info used to personalize AI?",
    answer: "Yes — update or delete it anytime in AI Settings. Changes apply to future AI outputs.",
  },
  {
    question: "What is “Help Our AI Get Smarter”?",
    answer: "It’s an opt-in program where anonymized usage & feedback help improve models and features.",
  },
  {
    question: "Is my data anonymized if I opt in?",
    answer: "Yes, we strip personal identifiers and aggregate the data. Sensitive content is excluded unless you explicitly submit it for training.",
  },
  {
    question: "Can I opt out of data sharing anytime?",
    answer: "Yes, toggle off data sharing in Privacy or AI Settings. Your choice is respected immediately for new data.",
  },
  {
    question: "Who processes payments?",
    answer: "We use Stripe to securely process all card and subscription payments.",
  },
  {
    question: "Is my card information safe?",
    answer: "Yes, card details are collected by Stripe Elements and tokenized. We do not store raw card numbers. Stripe is PCI-compliant.",
  },
  {
    question: "What payment methods are accepted?",
    answer: "Typically major credit/debit cards and regional methods Stripe supports. Available options depend on your country.",
  },
  {
    question: "How does checkout work?",
    answer: "Enter payment details on the secure Stripe-hosted payment form, choose a plan/billing cadence, then confirm purchase. You’ll get an email receipt.",
  },
  {
    question: "Can I update my card or payment method?",
    answer: "Yes — go to Billing > Payment methods to update. New cards are added securely via Stripe.",
  },
  {
    question: "How are invoices and receipts handled?",
    answer: "Receipts are emailed after each charge. Downloadable invoices appear in Billing > Invoices for paid plans, especially annual/enterprise.",
  },
  {
    question: "What happens if a payment fails?",
    answer: "Stripe will notify you by email and we’ll show a billing alert. We run retry logic (dunning). Update your card to avoid service interruption.",
  },
  {
    question: "Do you charge taxes?",
    answer: "Where applicable, tax (VAT/GST/sales tax) is calculated at checkout and on invoices based on billing address.",
  },
  {
    question: "Are refunds possible?",
    answer: "Refunds are handled per our Refund Policy. Full or partial refunds are issued through Stripe and processed back to the payment method.",
  },
  {
    question: "What are the plan options and billing cadences?",
    answer: "We offer Annual (billed yearly — typically discounted) and Monthly (billed every month) plans.",
  },
  {
    question: "Do annual plans auto-renew?",
    answer: "Yes, annual subscriptions auto-renew at term end unless canceled. Renewal reminders are sent in advance.",
  },
  {
    question: "How does cancellation work?",
    answer: "Cancel in Billing > Subscription. Cancellation takes effect at the end of your current billing period (you keep access until then). Immediate cancellations and refunds depend on policy and are handled case-by-case.",
  },
  {
    question: "Is there a free trial?",
    answer: "If offered, the trial will be shown at signup. Trials auto-convert to paid subscriptions unless canceled before they end.",
  },
  {
    question: "Are there discounts for annual billing?",
    answer: "Often yes, annual plans are typically discounted vs monthly. Promo codes and coupons are applied at checkout when available.",
  },
  {
    question: "How are seats or team members billed?",
    answer: "Seats are billed per active user unless your plan includes unlimited seats. Adding/removing seats adjusts your invoice; seat changes during a billing period are prorated.",
  },
  {
    question: "How do upgrades and downgrades work?",
    answer: "Upgrades usually take effect immediately and may incur a prorated charge for the remainder of the billing period. Downgrades typically take effect via an email request only, though some may be immediate and prorated depending on the change.",
  },
  {
    question: "Can I get an enterprise quote or pay by PO?",
    answer: "Yes, contact Sales for enterprise contracts, POs, SSO setup, custom billing cycles or volume discounts.",
  },
  {
    question: "I want all my data deleted, how?",
    answer: "Request data deletion via Account > Privacy or contact support. Deletion removes personal data; minimal billing records may be retained for legal/financial reasons.",
  },
  {
    question: "How do you handle PCI, privacy, and data usage?",
    answer: "We rely on Stripe for card processing (raw card data doesn’t touch our servers). Personalization and training participation are opt-in. Read the Privacy Policy and Terms for full details.",
  },
  {
    question: "Who can I contact if I still need help?",
    answer: "Email contactus@bidinsight.com. Include screenshots and your account email for fastest help.",
  },
];


const NeedHelpModal = ({ onClose }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ">
      <div className="bg-blue text-white rounded-2xl w-full max-w-2xl p-6 relative border border-white/20 ">
        
        {/* Close button */}
        <button className="absolute top-4 right-4 text-white text-2xl" onClick={onClose}>
          &times;
        </button>

        {/* Title */}
        <h2 className="text-center text-h3 text-g font-bold mb-3">Need help</h2>
        {/* <p className="text-center text-white/90 mb-6  max-w-xl mx-auto text-p font-inter">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan eros non fringilla
          faucibus.
        </p> */}

        {/* FAQ Accordion */}
        <div className="space-y-3 max-h-[500px] pe-4 overflow-scroll">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/20 rounded-lg p-3 transition-all"
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center gap-2 font-medium font-inter">
                  <CornerDownRight size={18} />
                  {faq.question}
                </div>
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {openIndex === index && faq.answer && (
                <p className="text-sm text-white/90 mt-3 pl-6 pr-2 leading-relaxed font-inter">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeedHelpModal;
