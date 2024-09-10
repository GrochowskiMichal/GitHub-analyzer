import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaBuilding, FaEnvelope, FaBriefcase, FaCalendarAlt, FaLink } from 'react-icons/fa';

interface ProfileSummaryProps {
  bio: string;
  location: string;
  company: string;
  userSince: React.ReactNode;
  hireable: boolean;
  email: string | null;
  links: string[];
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({
  bio,
  location,
  company,
  userSince,
  hireable,
  email,
  links,
}) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-6 bg-transparent  rounded-2xl shadow-2xl transform perspective-1000"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Profile Summary</h2>
      
      <motion.div 
        className="bg-transparent  rounded-xl mb-4 shadow-inner"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <p className="text-gray-300 italic">{bio || 'No bio available'}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem icon={<FaMapMarkerAlt />} label="Location" value={location} />
        <InfoItem icon={<FaBuilding />} label="Company" value={company} />
        <InfoItem icon={<FaEnvelope />} label="Email(can be fetched using only logged user fetching)" value={email} />
        <InfoItem icon={<FaBriefcase />} label="Hireable" value={hireable ? 'Yes' : 'No'} />
        <InfoItem icon={<FaCalendarAlt />} label="Member Since" value={userSince} />
      </div>

      {links.length > 0 && (
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white mb-3">Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {links.map((link, index) => (
              <motion.a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-700 rounded-lg text-blue-400 hover:bg-gray-600 transition-colors duration-200"
                whileHover={{ scale: 1.05, rotate: 2 }}
                onHoverStart={() => setHoveredLink(link)}
                onHoverEnd={() => setHoveredLink(null)}
              >
                <FaLink className="mr-2" />
                <span className="truncate">{new URL(link).hostname}</span>
                <AnimatePresence>
                  {hoveredLink === link && (
                    <motion.span
                      className="absolute bg-gray-800 text-white text-sm px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {link}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <motion.div 
    className="flex items-center bg-gray-700 p-3 rounded-lg"
    whileHover={{ scale: 1.05, rotateY: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-blue-400 mr-3 text-xl">{icon}</span>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-semibold">{value || 'N/A'}</p>
    </div>
  </motion.div>
);

export default ProfileSummary;