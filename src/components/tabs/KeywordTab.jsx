import React, { useEffect, useState, useCallback } from 'react';
import TagInput from './TagInput';

function KeywordTab({filters = {}, setFilters = () => {}}) {

  const [includeKeywords, setIncludeKeywords] = useState([]);
  const [excludeKeywords, setExcludeKeywords] = useState([]);

  // Reference/example tags for user guidance
  const includeReferenceTags = ["government contracts", "software development"];
  const excludeReferenceTags = ["international", "classified"];

  const handleIncludeChange = useCallback((tags) => {
    setIncludeKeywords(tags);
    setFilters({
      ...filters,
      keyword: {
        ...filters.keyword,
        include: tags
      }
    });
  }, [filters, setFilters]);

  const handleExcludeChange = useCallback((tags) => {
    setExcludeKeywords(tags);
    setFilters({
      ...filters,
      keyword: {
        ...filters.keyword,
        exclude: tags
      }
    });
  }, [filters, setFilters]);

  useEffect(() => {
    if (filters.keyword?.include) {
      setIncludeKeywords(filters.keyword.include);
    }
    if (filters.keyword?.exclude) {
      setExcludeKeywords(filters.keyword.exclude);
    }
  }, [filters.keyword]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Include */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Include</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={includeKeywords}
            exampleTags={includeReferenceTags}
            onTagsChange={handleIncludeChange}
          />
        </div>

        {/* Exclude */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Exclude</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={excludeKeywords}
            exampleTags={excludeReferenceTags}
            onTagsChange={handleExcludeChange}
          />
        </div>
      </div>

    
    </div>
  );
}

export default KeywordTab;
