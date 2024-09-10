import React from 'react';

// In ProfileFetcher.tsx
interface ProfileFetcherProps {
  profileUrl: string;
  setProfileUrl: React.Dispatch<React.SetStateAction<string>>;
  fetchProfileData: () => void;
  loading: boolean;
}

const ProfileFetcher: React.FC<ProfileFetcherProps> = ({ profileUrl, setProfileUrl, fetchProfileData, loading }) => {
  return (
    <div className="flex mb-4 w-full max-w-md">
      <input
        type="text"
        placeholder="Enter GitHub profile URL"
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        className="p-2 w-full border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
      />
      <button
        onClick={fetchProfileData}
        disabled={loading}
        className={`p-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Fetching...' : 'Fetch Profile'}
      </button>
    </div>
  );
};
export default ProfileFetcher;


