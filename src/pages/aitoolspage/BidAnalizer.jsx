// import React, { useState, useEffect } from 'react';
// import { Upload, Loader2, AlertCircle, CheckCircle, FileText, Download } from 'lucide-react';

// const BidAnalyzer = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [summaries, setSummaries] = useState([]);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [batchId, setBatchId] = useState(null);

//   useEffect(() => {
//     // Check if token exists
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       window.location.href = '/login';
//     }
//   }, []);

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setFiles(selectedFiles);
//     setError('');
//     setSuccess('');
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Processing...';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const fetchSummaries = async () => {
//     const token = localStorage.getItem('access_token');
//     try {
//       const response = await fetch('http://31.97.42.122:8082/api/ai/all-summary', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setSummaries(data);
//       } else {
//         throw new Error('Failed to fetch summaries');
//       }
//     } catch (err) {
//       setError('Failed to fetch summaries. Retrying...');
//       setTimeout(fetchSummaries, 5000);
//     }
//   };

//   const handleSubmit = async () => {
//     if (files.length === 0) {
//       setError('Please select at least one file');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');
//     setBatchId(null);

//     const token = localStorage.getItem('access_token');
//     const formData = new FormData();

//     files.forEach((file) => {
//       formData.append('files', file);
//     });

//     try {
//       const response = await fetch('http://31.97.42.122:8082/api/ai/summary', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (response.ok) {
//         const data = await response.json();

//         if (data.batch_id) {
//           setBatchId(data.batch_id);
//           setSuccess(`Files uploaded successfully! Batch ID: ${data.batch_id}`);

//           // Wait 3 seconds then call GET API
//           setTimeout(() => {
//             fetchSummaries();
//           }, 3000);
//         } else {
//           setError('Upload failed: No batch ID received');
//           setSummaries([{
//             id: 'failed',
//             status: 'failed',
//             created_at: new Date().toISOString(),
//             completed_at: null,
//             source_files: files.map(f => f.name),
//             source_files_urls: [],
//             result_file_url: []
//           }]);
//         }
//       } else {
//         throw new Error('Upload failed');
//       }
//     } catch (err) {
//       setError('Upload failed. Please try again.');
//       setSummaries([{
//         id: 'failed',
//         status: 'failed',
//         created_at: new Date().toISOString(),
//         completed_at: null,
//         source_files: files.map(f => f.name),
//         source_files_urls: [],
//         result_file_url: []
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Bid Analyzer</h1>
//           <p className="text-blue-200">Upload and analyze your bid documents</p>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
//           <div>
//             <div className="mb-6">
//               <label className="block mb-4 text-lg font-semibold">
//                 <Upload className="inline mr-2" size={20} />
//                 Select Files
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-white
//                   file:mr-4 file:py-3 file:px-6
//                   file:rounded-full file:border-0
//                   file:text-sm file:font-semibold
//                   file:bg-blue-500 file:text-white
//                   hover:file:bg-blue-600
//                   file:cursor-pointer cursor-pointer
//                   bg-white/5 rounded-xl p-4 border border-white/20"
//               />
//               {files.length > 0 && (
//                 <div className="mt-4 space-y-2">
//                   <p className="text-sm text-blue-200">Selected files:</p>
//                   {files.map((file, idx) => (
//                     <div key={idx} className="flex items-center text-sm bg-white/5 rounded-lg p-2">
//                       <FileText size={16} className="mr-2" />
//                       {file.name}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Messages */}
//             {error && (
//               <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center">
//                 <AlertCircle className="mr-2" size={20} />
//                 {error}
//               </div>
//             )}

//             {success && (
//               <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center">
//                 <CheckCircle className="mr-2" size={20} />
//                 {success}
//               </div>
//             )}

//             <button
//               onClick={handleSubmit}
//               disabled={loading || files.length === 0}
//               className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 
//                 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl
//                 transition-all duration-200 flex items-center justify-center"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin mr-2" size={20} />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="mr-2" size={20} />
//                   Submit Files
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Summary Table */}
//         {summaries.length > 0 && (
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
//             <div className="p-6 border-b border-white/20">
//               <h2 className="text-2xl font-bold">Summaries</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-white/5">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Batch ID</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Completed At</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Source Files</th>
//                     <th className="px-6 py-4 text-left text-sm font-semibold">Result Files</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/10">
//                   {summaries.map((summary, idx) => (
//                     <tr key={idx} className="hover:bg-white/5 transition-colors">
//                       <td className="px-6 py-4 text-sm font-mono">{summary.id}</td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
//                           ${summary.status === 'completed' ? 'bg-green-500/20 text-green-300' : 
//                             summary.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' : 
//                             'bg-red-500/20 text-red-300'}`}>
//                           {summary.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm">{formatDate(summary.created_at)}</td>
//                       <td className="px-6 py-4 text-sm">{formatDate(summary.completed_at)}</td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           {summary.source_files_urls?.map((file, i) => (
//                             <a
//                               key={i}
//                               href={file.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="flex items-center text-sm text-blue-300 hover:text-blue-200 hover:underline"
//                             >
//                               <Download size={14} className="mr-1" />
//                               {file.name}
//                             </a>
//                           ))}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="space-y-1">
//                           {summary.result_file_url?.map((file, i) => (
//                             <a
//                               key={i}
//                               href={file.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="flex items-center text-sm text-green-300 hover:text-green-200 hover:underline"
//                             >
//                               <Download size={14} className="mr-1" />
//                               {file.name}
//                             </a>
//                           ))}
//                           {(!summary.result_file_url || summary.result_file_url.length === 0) && (
//                             <span className="text-sm text-gray-400">Pending...</span>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BidAnalyzer;









import React, { useState, useEffect } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, FileText, Download } from 'lucide-react';

const BidAnalyzer = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [batchId, setBatchId] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
    } else {
      // Page load hote hi data fetch karo
      fetchSummaries();
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Append new files to existing ones instead of replacing
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    setError('');
    setSuccess('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      setError('');
      setSuccess('');
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Processing...';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchSummaries = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://31.97.42.122:8082/api/ai/all-summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSummaries(data);
        setLoading(false);
      } else {
        throw new Error('Failed to fetch summaries');
      }
    } catch (err) {
      setError('Failed to fetch summaries. Retrying...');
      setTimeout(fetchSummaries, 5000);
    }
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setBatchId(null);

    const token = localStorage.getItem('access_token');
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://31.97.42.122:8082/api/ai/summary', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();

        if (data.batch_id) {
          setBatchId(data.batch_id);
          setSuccess(`Files uploaded successfully! Batch ID: ${data.batch_id}`);

          // Wait 3 seconds then call GET API
          setTimeout(() => {
            fetchSummaries();
          }, 3000);
        } else {
          setError('Upload failed: No batch ID received');
          setSummaries([{
            id: 'failed',
            status: 'failed',
            created_at: new Date().toISOString(),
            completed_at: null,
            source_files: files.map(f => f.name),
            source_files_urls: [],
            result_file_url: []
          }]);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      setError('Upload failed. Please try again.');
      setSummaries([{
        id: 'failed',
        status: 'failed',
        created_at: new Date().toISOString(),
        completed_at: null,
        source_files: files.map(f => f.name),
        source_files_urls: [],
        result_file_url: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bid Analyzer</h1>
          <p className="text-blue-200">Upload and analyze your bid documents</p>
        </div>

        {/* Upload Section */}
        <div className="bg-blue backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
          <div>
            <div className="mb-6">
              <label className="block mb-4 text-lg font-semibold">
                <Upload className="inline mr-2" size={20} />
                Select Files
              </label>

              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
                  ${dragActive ? 'border-blue-400 bg-blue-500/20' : 'border-white/30 bg-white/5'}
                  hover:border-blue-400 hover:bg-blue-500/10`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="file-input"
                />
                <div className="pointer-events-none">
                  <Upload className="mx-auto mb-4" size={48} />
                  <p className="text-lg mb-2">Drag & Drop files here</p>
                  <p className="text-sm text-blue-200">or click to browse</p>
                  <p className="text-xs text-blue-300 mt-2">Multiple files supported</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-blue-200 font-semibold">
                      Selected files ({files.length}):
                    </p>
                    <button
                      onClick={clearAllFiles}
                      className="text-xs text-red-300 hover:text-red-200 underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors">
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText size={16} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="ml-2 text-red-400 hover:text-red-300 flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center">
                <AlertCircle className="mr-2" size={20} />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center">
                <CheckCircle className="mr-2" size={20} />
                {success}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || files.length === 0}
              className="w-full bg-blue hover:bg-blue-600 disabled:bg-gray-500 
                disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl
                transition-all duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Submit Files
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Table */}
        {summaries.length > 0 && (
          <div className="bg-blue backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold">Summaries</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Batch ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Completed At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Source Files</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Result Files</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {summaries.map((summary, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{summary.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                          ${summary.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                            summary.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'}`}>
                          {summary.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDate(summary.created_at)}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(summary.completed_at)}</td>
                      {/* // Source Files cell mein (line ~360 ke aas paas) */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {summary.source_files_urls?.map((file, i) => (
                            <a

                              key={i}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-blue-300 hover:text-blue-200 hover:underline"
                              title={file.name} // Hover pe pura naam dikhega
                            >
                              <Download size={14} className="mr-1 flex-shrink-0" />
                              <span className="truncate max-w-[200px]"> {/* Width adjust kar sakte ho */}
                                {file.name.length > 30
                                  ? `${file.name.substring(0, 30)}...`
                                  : file.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {summary.result_file_url?.map((file, i) => (
                            <a
                              key={i}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-green-300 hover:text-green-200 hover:underline"
                            >
                              <Download size={14} className="mr-1" />
                              {file.name}
                            </a>
                          ))}
                          {(!summary.result_file_url || summary.result_file_url.length === 0) && (
                            <span className="text-sm text-gray-400">Pending...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};

export default BidAnalyzer;