import React, { useEffect, useState } from 'react';
import TagInput from './TagInput';

function KeywordTab({
  filters,
  setFilters,
  onApply,
  setActiveTab,
  searchOption,
  setShowValidation,
  setTriggerSave,
  onSubmit = () => {}, // <-- Add this line
}) {
  const [showExampleInclude, setShowExampleInclude] = useState(true);
  const [showExampleExclude, setShowExampleExclude] = useState(true);

  const defaultIncludeExample = ['example include'];
  const defaultExcludeExample = ['example exclude'];

  const includeTags = showExampleInclude && (!filters.includeKeywords || filters.includeKeywords.length === 0)
    ? defaultIncludeExample
    : filters.includeKeywords;

  const excludeTags = showExampleExclude && (!filters.excludeKeywords || filters.excludeKeywords.length === 0)
    ? defaultExcludeExample
    : filters.excludeKeywords;

  const handleIncludeChange = (tags) => {
    const realTags = tags.includes(defaultIncludeExample[0]) ? tags.filter(tag => tag !== defaultIncludeExample[0]) : tags;

    if (showExampleInclude) setShowExampleInclude(false); // turn off example

    setFilters((prev) => ({
      ...prev,
      includeKeywords: realTags,
    }));
  };

  const handleExcludeChange = (tags) => {
    const realTags = tags.includes(defaultExcludeExample[0]) ? tags.filter(tag => tag !== defaultExcludeExample[0]) : tags;

    if (showExampleExclude) setShowExampleExclude(false); // turn off example

    setFilters((prev) => ({
      ...prev,
      excludeKeywords: realTags,
    }));
  };

  const handleSearchClick = () => {
    const isCreateMode = searchOption === 'create';
    const isEmpty = isCreateMode && !filters.searchName?.trim();

    if (isEmpty) {
      setShowValidation?.(true);
      setActiveTab?.('Save Search Form');
      return;
    }

    if (isCreateMode) {
      // Pass full filters object, not just keywords
      const payload = {
        filters: { ...filters },
        name: filters.searchName?.trim(),
        action: searchOption,
      };
      onSubmit(payload);
    } else {
      onApply?.();
    }
  };

  const handleCancel = () => {
    setShowValidation?.(false);
    setActiveTab?.('Save Search Form');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Include */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Include</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={includeTags}
            onTagsChange={handleIncludeChange}
          />
        </div>

        {/* Exclude */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Exclude</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={excludeTags}
            onTagsChange={handleExcludeChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          className="border-[2px] px-10 py-3 rounded-[20px] font-archivo text-xl transition-all"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="bg-primary text-white px-10 py-3 rounded-[20px] font-archivo text-xl hover:bg-blue-700 transition-all"
          onClick={handleSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default KeywordTab;
