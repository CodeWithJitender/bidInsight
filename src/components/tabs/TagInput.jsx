// TagInput.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function TagInput({
  placeholder = "Type and hit Enter",
  defaultTags = []
}) {
  const [tags, setTags] = useState(defaultTags);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTags(defaultTags);
  }, [defaultTags]);

  const addTag = (value) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const next = [...tags, trimmed];
      setTags(next);
      console.log("tags:", next);
    }
  };

  const removeTag = (idx) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && textareaRef.current.value) {
      e.preventDefault();
      addTag(textareaRef.current.value);
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-2 p-2 bg-white border-[#273BE280] rounded-[10px] border-[2px]">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center  border border-primary rounded-full text-[16px] px-4 py-2"
        >
          {tag}
          <button
            onClick={() => removeTag(i)}
            className="ml-2 text-primary"
          >
            &times;
          </button>
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


 