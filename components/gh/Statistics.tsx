import React from 'react';
import { FaCode, FaFileAlt, FaUsers, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface StatisticsProps {
  repoCount: number;
  gistsCount: number;
  followers: number;
  following: number;
}

const Statistics: React.FC<StatisticsProps> = ({
  repoCount,
  gistsCount,
  followers,
  following,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-6 bg-transparent rounded-2xl shadow-2xl transform perspective-1000"
    >
      <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
        <FaCode className="mr-2" />
        Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatItem icon={<FaCode />} label="Repositories" value={repoCount} />
        <StatItem icon={<FaFileAlt />} label="Gists" value={gistsCount} />
        <StatItem icon={<FaUsers />} label="Followers" value={followers} />
        <StatItem icon={<FaUserPlus />} label="Following" value={following} />
      </div>
    </motion.div>
  );
};

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <motion.div
    className="flex items-center bg-gray-700 p-3 rounded-lg"
    whileHover={{ scale: 1.05, rotateY: 10 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <span className="text-blue-400 mr-3 text-xl">{icon}</span>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default Statistics;
