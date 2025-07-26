import React from 'react';

function StatusTab({filters = {}, setFilters = () => {}}) {

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div>
        <div className="space-y-6">
          {/* Solicitations Radio Group */}
          <div>
            <h2 className="text-p font-inter font-bold mb-2">Solicitations</h2>
            <div className="space-y-3">
              {[
                { label: "Open Solicitations", value: "Active" },
                { label: "Closed Solicitations", value: "Inactive" }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="solicitation"
                    value={option.value}
                    className="accent-purple-600"
                    checked={filters.status === option.value}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  />
                  <span className="font-inter text-xl">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

       
        </div>
      </div>

      
    </div>
  );
}

export default StatusTab;