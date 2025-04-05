import React, { useState } from 'react';

const RoommateSurveyModal = ({ show, onClose, onSave }) => {
  const [surveyData, setSurveyData] = useState({
    sleepSchedule: 'morning',
    smoking: 'non-smoker',
    noisePreference: 3,
    neatness: 3,
    guestsFrequency: 'rarely'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(surveyData);
  };

  return show ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Roommate Compatibility Survey</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Survey Questions */}
          <div>
            <label className="block text-gray-700 mb-2">Sleep Schedule:</label>
            <select
              value={surveyData.sleepSchedule}
              onChange={(e) => setSurveyData({...surveyData, sleepSchedule: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="morning">Morning Person</option>
              <option value="night">Night Owl</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Smoking Preference:</label>
            <div className="flex gap-4">
              {['smoker', 'non-smoker', 'occasionally'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="smoking"
                    value={option}
                    checked={surveyData.smoking === option}
                    onChange={(e) => setSurveyData({...surveyData, smoking: e.target.value})}
                    className="mr-2"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Noise Preference (1-5):</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSurveyData({...surveyData, noisePreference: num})}
                  className={`w-10 h-10 rounded-full ${
                    surveyData.noisePreference === num 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Neatness Importance (1-5):</label>
            <input
              type="range"
              min="1"
              max="5"
              value={surveyData.neatness}
              onChange={(e) => setSurveyData({...surveyData, neatness: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>Not Important</span>
              <span>Very Important</span>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Save Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default RoommateSurveyModal;