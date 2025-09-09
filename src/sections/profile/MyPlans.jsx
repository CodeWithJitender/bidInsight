import React from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";
import FeatureSlider from "./FeatureSlider";
import { useSelector } from "react-redux";

// Dummy transactions
const transactions = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  description: "Lorem Ipsum",
  transactionId: "12345678910",
  date: "12th August,2025",
  amount: "$1000.00",
  plan: "AI Powerhouse",
}));

export default function MyPlans() {
  const subscriptionPlanId = useSelector(
    (state) => state.profile?.profile?.subscription_plan?.plan_code || null
  );
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
                  <i class="fas fa-robot w-20 h-20 flex items-center justify-center bg-primary rounded-[10px] text-white text-xl"></i>
                  {/* <img src="/ai-myplan.png" className="bg-primary" alt="" /> */}
                </div>
                <div className="h-20 flex flex-col justify-between ps-4">
                  <div className="text-lg font-inter font-medium text-[#999999]">
                    Subscription Plan
                  </div>
                  <h2 className="text-xl font-inter font-medium">
                    AI Powerhouse
                  </h2>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Recharge</p>
              <p className="font-medium">12-09-2025</p>
            </div>
          </div>
          <div className="flex justify-between w-full">
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                Frequency:
              </div>
              <div className="font-inter text-lg font-medium">Monthly</div>
            </p>
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                Next Charge:
              </div>
              <div className="font-inter text-lg font-medium">12-11-2025</div>
            </p>
            <p className="mt-5 ">
              <div className="text-lg font-inter font-medium text-[#999999]">
                <div className="flex items-center gap-2">
                  Bolt-On
                  <FiExternalLink className="text-purple-500 cursor-pointer" />
                </div>
              </div>
              <div className="font-inter text-lg font-medium">State</div>
            </p>
          </div>
        </div>

        {/* Features Carousel (Static Example) */}
        <div className="border-2 border-primary rounded-xl p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">My Features</h2>
          <div className="p-4">
            <FeatureSlider />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      {subscriptionPlanId !=="001" && (
        <div className="border-2 border-primary rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="font-inter font-medium">
              <tr className="border-b-2 border-primary bg-gray-50">
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Transaction Id</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4 text-center  ">Download</th>
              </tr>
            </thead>
            <tbody className="font-inter font-medium">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{tx.description}</td>
                  <td className="py-3 px-4">{tx.transactionId}</td>
                  <td className="py-3 px-4">{tx.date}</td>
                  <td className="py-3 px-4 font-bold">{tx.amount}</td>
                  <td className="py-3 px-4">{tx.plan}</td>
                  <td className="py-3 px-4 flex justify-center">
                    <FiDownload className="cursor-pointer hover:text-primary" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
