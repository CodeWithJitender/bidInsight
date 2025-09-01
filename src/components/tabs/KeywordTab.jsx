import React, { useEffect, useState, useCallback } from 'react';
import TagInput from './TagInput';

function KeywordTab({filters = {}, setFilters = () => {}}) {

  const [includeKeywords, setIncludeKeywords] = useState([]);
  const [excludeKeywords, setExcludeKeywords] = useState([]);

  const handleIncludeChange = useCallback((tags) => {
    setIncludeKeywords(tags);
    setFilters(prevFilters => ({
      ...prevFilters,
      keyword: {
        ...prevFilters.keyword,
        include: tags
      }
    }));
  }, [setFilters]);

  const handleExcludeChange = useCallback((tags) => {
    setExcludeKeywords(tags);
    setFilters(prevFilters => ({  
      ...prevFilters,
      keyword: {
        ...prevFilters.keyword,
        exclude: tags
      }
    }));
  }, [setFilters]);

  useEffect(() => {
    if (filters.keyword?.include && JSON.stringify(filters.keyword.include) !== JSON.stringify(includeKeywords)) {
      setIncludeKeywords(filters.keyword.include);
    }
    if (filters.keyword?.exclude && JSON.stringify(filters.keyword.exclude) !== JSON.stringify(excludeKeywords)) {
      setExcludeKeywords(filters.keyword.exclude);
    }
  }, [filters.keyword?.include, filters.keyword?.exclude]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between p-10 ps-14">
      <div>
        {/* Include */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Include</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={includeKeywords}
            // exampleTags={includeReferenceTags}
            onTagsChange={handleIncludeChange}
          />
        </div>

        {/* Exclude */}
        <div className="mb-6">
          <h3 className="font-semibold block font-inter text-p mb-4">Exclude</h3>
          <TagInput
            placeholder="Add Keywords"
            defaultTags={excludeKeywords}
            // exampleTags={excludeReferenceTags}
            onTagsChange={handleExcludeChange}
          />
        </div>
      </div>

    
    </div>
  );
}

export default KeywordTab;
