// 'use client'
// import React, { useState } from 'react';
// import { X, Filter, ChevronDown } from 'lucide-react';

// // Types
// export interface FilterField {
//   key: string;
//   label: string;
//   name:string;
//   type: 'text' | 'select' | 'date' | 'number' | 'multiselect';
//   options?: { name: string; id: string }[];
//   placeholder?: string;
// }

// export interface FilterValues {
//   [key: string]: any;
// }

// interface DynamicFilterProps {
//   isOpen: boolean;
//   onClose: () => void;
//   fields: FilterField[];
//   values: FilterValues;
//   onApply: (values: FilterValues) => void;
//   onReset: () => void;
// }

// // Main Filter Component
// function DynamicFilter({ isOpen,
//   onClose,
//   fields,
//   values,
//   onApply,
//   onReset,}:DynamicFilterProps){
//   const [localValues, setLocalValues] = useState<FilterValues>(values);

//   const handleChange = (key: string, value: any) => {
//     setLocalValues(prev => ({ ...prev, [key]: value }));
//   };

//   const handleApply = () => {
//     onApply(localValues);
//     onClose();
//   };

//   const handleReset = () => {
//     const resetValues = fields.reduce((acc, field) => {
//       acc[field.key] = field.type === 'multiselect' ? [] : '';
//       return acc;
//     }, {} as FilterValues);
//     setLocalValues(resetValues);
//     onReset();
//   };

//   const toggleMultiSelect = (key: string, value: string) => {
//     const current = localValues[key] || [];
//     const updated = current.includes(value)
//       ? current.filter((v: string) => v !== value)
//       : [...current, value];
//     handleChange(key, updated);
//   };

//   return (
//     <>
//       {/* Backdrop */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
//           onClick={onClose}
//         />
//       )}

//       {/* Filter Panel */}
//       <div
//         className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4 border-b">
//             <div className="flex items-center gap-2">
//               <Filter className="w-5 h-5 text-blue-600" />
//               <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Filter Fields */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {fields.map(field => (
//               <div key={field.key} className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label}
//                 </label>

//                 {field.type === 'text' && (
//                   <input
//                     type="text"
//                     value={localValues[field.key] || ''}
//                     onChange={(e) => handleChange(field.key, e.target.value)}
//                     placeholder={field.placeholder}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 )}

//                 {field.type === 'number' && (
//                   <input
//                     type="number"
//                     value={localValues[field.key] || ''}
//                     onChange={(e) => handleChange(field.key, e.target.value)}
//                     placeholder={field.placeholder}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 )}

//                 {field.type === 'date' && (
//                   <input
//                     type="date"
//                     value={localValues[field.key] || ''}
//                     onChange={(e) => handleChange(field.key, e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//                   />
//                 )}

//                 {field.type === 'select' && (
//                   <div className="relative">
//                     <select
//                       value={localValues[field.key] || ''}
//                       onChange={(e) => handleChange(field.key, e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
//                     >
//                       <option value="">Select {field.label}</option>
//                       {field.options?.map(opt => (
//                         <option key={opt.value} value={opt.value}>
//                           {opt.label}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//                   </div>
//                 )}

//                 {field.type === 'multiselect' && (
//                   <div className="space-y-2 border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
//                     {field.options?.map(opt => (
//                       <label
//                         key={opt.value}
//                         className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={(localValues[field.key] || []).includes(opt.value)}
//                           onChange={() => toggleMultiSelect(field.key, opt.value)}
//                           className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700">{opt.label}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Footer Actions */}
//           <div className="border-t p-4 space-y-2">
//             <button
//               onClick={handleApply}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               Apply Filters
//             </button>
//             <button
//               onClick={handleReset}
//               className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
//             >
//               Reset Filters
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// // Export the component for use in your project
// export { DynamicFilter };