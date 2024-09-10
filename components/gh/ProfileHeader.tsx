import React from 'react';
import { FaGithub } from 'react-icons/fa';

interface ProfileHeaderProps {
  name: string;
  avatarUrl: string;
  htmlUrl: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatarUrl, htmlUrl }) => {
  return (
    <div className="flex items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-md transition-transform transform hover:scale-105">
      <img 
        src={avatarUrl} 
        alt="Profile Picture" 
        className="w-20 h-20 rounded-full border-2 border-blue-400 shadow-lg transition-transform transform hover:scale-110" 
      />
      <div className="ml-4">
        <p className="text-2xl font-bold text-white hover:text-blue-300 transition-colors">{name}</p>
        <p className="text-gray-300 text-sm">
          <a 
            href={htmlUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-blue-400 hover:underline transition-colors"
          >
            <FaGithub className="mr-2" /> 
            {htmlUrl}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
