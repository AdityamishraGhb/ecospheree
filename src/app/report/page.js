'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isAuthenticated, getCurrentUser } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import MapView from '../../components/MapView';

const ReportPage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formData, setFormData] = useState({
    type: 'accident',
    severity: 'minor',
    location: '',
    description: ''
  });

  // Mock data for existing reports
  const mockReports = [
    {
      id: 1,
      type: 'accident',
      severity: 'major',
      location: '123 Main St, Springfield',
      description: 'Multiple vehicles involved in collision',
      status: 'verified',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      reporter: 'john.doe@example.com',
      coordinates: [40.7128, -74.0060],
      aiAssessment: {
        confidence: 0.92,
        classification: 'major',
        notes: 'Traffic flow severely impacted, emergency services required'
      },
      communityVerified: 15,
      communityDisputed: 2
    },
    {
      id: 2,
      type: 'congestion',
      severity: 'moderate',
      location: '456 Oak Ave, Springfield',
      description: 'Heavy traffic due to construction work',
      status: 'pending',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      reporter: 'jane.smith@example.com',
      coordinates: [40.7318, -73.9866],
      aiAssessment: {
        confidence: 0.78,
        classification: 'moderate',
        notes: 'Expected to clear within 1-2 hours'
      },
      communityVerified: 8,
      communityDisputed: 1
    },
    {
      id: 3,
      type: 'accident',
      severity: 'minor',
      location: '789 Pine Rd, Springfield',
      description: 'Fender bender, vehicles moved to side of road',
      status: 'resolved',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      reporter: 'mike.johnson@example.com',
      coordinates: [40.7418, -73.9901],
      aiAssessment: {
        confidence: 0.85,
        classification: 'minor',
        notes: 'Minimal impact on traffic flow'
      },
      communityVerified: 12,
      communityDisputed: 0
    }
  ];

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      if (!isAuth) {
        router.push('/auth/login');
        return;
      }

      const currentUser = getCurrentUser();
      setUser(currentUser);
      setReports(mockReports);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate a mock AI assessment
    const confidence = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0
    const classification = formData.severity;
    const notes = formData.severity === 'major' 
      ? 'Traffic flow severely impacted, emergency services required' 
      : formData.severity === 'moderate'
        ? 'Moderate impact on traffic flow'
        : 'Minimal impact on traffic flow';
    
    // Create file information objects (in a real app, these would be URLs after upload)
    const fileInfo = uploadedFiles.map(file => ({
      name: file.name,
      type: file.type.startsWith('image') ? 'image' : 'video',
      size: Math.round(file.size / 1024) + ' KB'
    }));
    
    // Create new report
    const newReport = {
      id: reports.length + 1,
      ...formData,
      status: 'pending',
      timestamp: new Date().toISOString(),
      reporter: user?.email || 'anonymous',
      coordinates: [40.7128 + (Math.random() * 0.1), -74.0060 + (Math.random() * 0.1)],
      aiAssessment: {
        confidence,
        classification,
        notes
      },
      communityVerified: 0,
      communityDisputed: 0,
      mediaFiles: fileInfo
    };
    
    // Add to reports array
    setReports([newReport, ...reports]);
    
    // Reset form
    setFormData({
      type: 'accident',
      severity: 'minor',
      location: '',
      description: ''
    });
    setUploadedFiles([]);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'major':
        return 'text-red-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'minor':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Report</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Report accidents and congestions to help others stay safe and plan their routes better. 
          Our AI will verify your reports using crowdsourced information.
        </p>
      </div>
      
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p>Your report has been submitted successfully! Thank you for contributing to community safety.</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Report Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Report an Incident</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Incident Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="accident">Accident</option>
                <option value="congestion">Road Congestion</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Severity
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="major">Major</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Location Address
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter address or intersection"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about the incident"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
                rows="4"
                required
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                Upload Photos or Videos (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" accept="image/*,video/*" className="sr-only" multiple onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB</p>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">{uploadedFiles.length} file(s) selected</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
            >
              Report
            </button>
          </form>
        </div>
        
        {/* Map View */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="h-96">
            <MapView trafficEvents={reports.map(report => ({
              id: report.id,
              type: report.type === 'accident' ? 'accident' : 'roadwork',
              coordinates: report.coordinates,
              description: report.description
            }))} />
          </div>
        </div>
      </div>
      
      {/* Recent Reports */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Reports</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reported</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize">{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`capitalize font-medium ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{report.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)} text-white`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(report.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => viewReportDetails(report)}
                        className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal for Report Details */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                      Incident Report #{selectedReport.id}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedReport.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Severity</p>
                        <p className={`font-medium capitalize ${getSeverityColor(selectedReport.severity)}`}>
                          {selectedReport.severity}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.location}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.description}</p>
                    </div>
                    
                    {selectedReport.mediaFiles && selectedReport.mediaFiles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Uploaded Media</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedReport.mediaFiles.map((file, index) => (
                            <div key={index} className="p-2 border rounded-md border-gray-300 dark:border-gray-700">
                              <div className="flex items-center">
                                {file.type === 'image' ? (
                                  <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                )}
                                <div className="text-sm">
                                  <p className="text-gray-900 dark:text-white font-medium truncate" style={{ maxWidth: "120px" }}>{file.name}</p>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">{file.size}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reported By</p>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.reporter}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Reported At</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatTimestamp(selectedReport.timestamp)}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">AI Assessment</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Confidence</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {(selectedReport.aiAssessment.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Classification</span>
                          <span className={`text-sm font-medium capitalize ${getSeverityColor(selectedReport.aiAssessment.classification)}`}>
                            {selectedReport.aiAssessment.classification}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">AI Notes</span>
                          <p className="text-sm text-gray-900 dark:text-white">{selectedReport.aiAssessment.notes}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Community Verification</h4>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{selectedReport.communityVerified} verified</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          <span>{selectedReport.communityDisputed} disputed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage; 