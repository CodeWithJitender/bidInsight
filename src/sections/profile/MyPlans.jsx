import React from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import FeatureSlider from "./FeatureSlider";
import { useSelector } from "react-redux";

export default function MyPlans({ paymentData, paymentLoading, onReceiptDownload, profileData }) {
  console.log(profileData.subscription_plan, "🔥 Profile Data in MyPlanssssssssssssssssssssssssssssssssssssss");
  const subscriptionPlanId = useSelector(
    (state) => state.profile?.profile?.subscription_plan?.plan_code || null
  );

  const transactions = paymentData || [];

  // Check if user is on free plan
  const isFreeplan = subscriptionPlanId === "001";

  // Amount ko dollar format mein convert karna
  const formatAmount = (amount) => {
    return `$${(amount / 100).toFixed(2)}`; // cents to dollars
  };

  // Date format karna
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Plan name extract karna metadata se
  const getPlanName = (metadata) => {
    try {
      const detail = JSON.parse(metadata.detail);
      return detail.plan.name || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  // Receipt download handler
  const handleDownloadClick = (paymentId) => {
    if (onReceiptDownload) {
      onReceiptDownload(paymentId);
    }
  };

  return (
    <div className="p-6 font-inter">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Subscription Card */}
        <div className="border-2 border-primary rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-stretch">
                <div className="">
                  <i className="fas fa-robot w-20 h-20 flex items-center justify-center bg-primary rounded-[10px] text-white text-xl"></i>
                  {/* <img src="/ai-myplan.png" className="bg-primary" alt="" /> */}
                </div>
                <div className="h-20 flex flex-col justify-between ps-4">
                  <div className="text-lg font-inter font-medium text-[#999999]">
                    Subscription Plan
                  </div>
                  <h2 className="text-xl font-inter font-medium">
                    {isFreeplan ? "Free" : (profileData?.subscription_plan?.name || "N/A")}
                  </h2>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Payment</p>
              <p className="font-medium">
                {isFreeplan ? "N/A" : formatDate(profileData?.subscription_plan?.plan_starts_at)}
              </p>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                Frequency:
              </div>
              <div className="font-inter text-lg font-medium">
                {isFreeplan ? "N/A" : (
                  profileData?.subscription_plan?.recurring_interval?.charAt(0).toUpperCase() +
                  profileData?.subscription_plan?.recurring_interval?.slice(1) || 'N/A'
                )}
              </div>
            </p>
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                Next Charge:
              </div>
              <div className="font-inter text-lg font-medium">
                {isFreeplan ? "N/A" : formatDate(profileData?.subscription_plan?.plan_starts_at)}
              </div>
            </p>
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                <div className="flex items-center gap-2">
                  Bolt-On
                  <FiExternalLink className="text-purple-500 cursor-pointer" />
                </div>
              </div>
              <div className="font-inter text-lg font-medium">
                {isFreeplan ? "N/A" : "State"}
              </div>
            </p>
          </div>
        </div>

        {/* Features Carousel */}
        <div className="border-2 border-primary rounded-xl p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">
            {isFreeplan ? "Locked Features" : "My Features"}
          </h2>
          <div className="p-4">
            <FeatureSlider currentPlan={subscriptionPlanId} />
          </div>
        </div>
      </div>

      {/* Transactions Table - Only show for non-free plans */}
      {subscriptionPlanId !== "001" && (
        <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
          {paymentLoading ? (
            <div className="p-6 text-center">Loading payments...</div>
          ) : transactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead className="font-inter font-medium">
                <tr className="border-b-2 border-primary bg-gray-50">
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Transaction Id</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="font-inter font-medium">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">Payment for {getPlanName(tx.metadata)}</td>
                    <td className="py-3 px-4">{tx.stripe_payment_intent_id}</td>
                    <td className="py-3 px-4">{formatDate(tx.created_at)}</td>
                    <td className="py-3 px-4 font-bold">{formatAmount(tx.amount)}</td>
                    <td className="py-3 px-4">{getPlanName(tx.metadata)}</td>
                    <td className="py-3 px-4 flex justify-center">
                      <FiDownload
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleDownloadClick(tx.id)}
                        title="Download Receipt"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">No payment history found</div>
          )}
        </div>
      )}
    </div>
  );
}