import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function TagInput({
  placeholder = "Type and hit Enter",
  defaultTags = [],
  exampleTags = [],
  onTagsChange = () => {}
}) {
  const [tags, setTags] = useState(defaultTags);
  const [examples, setExamples] = useState(exampleTags);
  const textareaRef = useRef(null);

  // Use refs to track previous values and avoid infinite loops
  const prevDefaultTagsRef = useRef();
  const prevExampleTagsRef = useRef();

  // Only update tags when defaultTags actually changes
  useEffect(() => {
    const defaultTagsString = JSON.stringify(defaultTags);
    const prevDefaultTagsString = JSON.stringify(prevDefaultTagsRef.current);
    
    if (defaultTagsString !== prevDefaultTagsString) {
      setTags(defaultTags);
      prevDefaultTagsRef.current = defaultTags;
    }
  }, [defaultTags]);

  // Only update examples when exampleTags actually changes
  useEffect(() => {
    const exampleTagsString = JSON.stringify(exampleTags);
    const prevExampleTagsString = JSON.stringify(prevExampleTagsRef.current);
    
    if (exampleTagsString !== prevExampleTagsString) {
      setExamples(exampleTags);
      prevExampleTagsRef.current = exampleTags;
    }
  }, [exampleTags]);

  // Call onTagsChange when tags change, but avoid calling it on initial render if tags match defaultTags
  useEffect(() => {
    const isInitialRender = JSON.stringify(tags) === JSON.stringify(defaultTags) && tags.length === 0;
    if (!isInitialRender) {
      onTagsChange(tags);
    }
  }, [tags]); // Only depend on tags, not onTagsChange

  const addTag = useCallback((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    // Don't add if it's an example tag - they are for reference only
    if (exampleTags.includes(trimmed)) {
      return;
    }

    // Only add if it's not already in the tags array
    if (!tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
  }, [exampleTags, tags]);

  const removeTag = useCallback((idx) => {
    setTags(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleKeyDown = useCallback((e) => {
    if ((e.key === 'Enter' || e.key === ',') && textareaRef.current.value) {
      e.preventDefault();
      addTag(textareaRef.current.value);
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
  }, [addTag]);

  return (
    <div className="flex flex-wrap items-start gap-2 p-2 bg-white border-[#273BE280] rounded-[10px] border-[2px]">
      {tags.map((tag, i) => (
        <span
          key={`tag-${i}`}
          className="flex items-center border border-primary rounded-full text-[16px] px-4 py-2"
        >
          {tag}
          <button onClick={() => removeTag(i)} className="ml-2 text-primary">
            &times;
          </button>
        </span>
      ))}

      {examples.map((tag, i) => (
        <span
          key={`example-${i}`}
          className="flex items-center border border-gray-300 text-gray-500 italic rounded-full text-[16px] px-4 py-2 bg-gray-50 cursor-not-allowed opacity-70"
          title="Reference tag - for guidance only"
        >
          {tag}
        </span>
      ))}

      <textarea
        ref={textareaRef}
        rows={6}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[100px] bg-transparent outline-none resize-none text-sm leading-tight"
        placeholder={placeholder}
      />
    </div>
  );
}
