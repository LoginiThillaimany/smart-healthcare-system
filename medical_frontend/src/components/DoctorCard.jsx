import React from 'react';

const DoctorCard = ({ doctor, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect && onSelect(doctor)}
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-2 ${
        isSelected ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:border-emerald-200'
      } transform hover:scale-105`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 medical-gradient rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
          👨‍⚕️
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg mb-1">
            Dr. {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-sm text-emerald-600 font-medium mb-2">{doctor.specialty}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{doctor.rating || '4.8'}</span>
              <span className="text-gray-400 ml-1">({doctor.reviewCount || '120'})</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{doctor.experience || '15'}+ years</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{doctor.hospitalAffiliation || 'General Hospital'}</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${doctor.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={doctor.availability ? 'text-green-600' : 'text-red-600'}>
                  {doctor.availability ? 'Available Today' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 pt-4 border-t border-emerald-200">
          <div className="flex items-center justify-center space-x-2 text-emerald-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Selected</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;
