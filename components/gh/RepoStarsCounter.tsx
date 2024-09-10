import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface RepoStarsCounterProps {
  repos: Array<{ stargazers_count: number }>;
}

const RepoStarsCounter: React.FC<RepoStarsCounterProps> = ({ repos }) => {
  const [totalStars, setTotalStars] = useState<number>(0);

  useEffect(() => {
    if (repos && repos.length > 0) {
      const stars = repos.reduce((acc: number, repo: { stargazers_count: number }) => acc + repo.stargazers_count, 0);
      setTotalStars(stars);
    }
  }, [repos]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-6 bg-transparent rounded-2xl shadow-2xl transform perspective-1000"
    >
      <h2 className="text-3xl font-bold text-white mb-4 flex items-center">
        <FaStar className="mr-2" />
        Repository Stars
      </h2>
      <motion.div
        className="flex items-center bg-gray-700 p-3 rounded-lg"
        whileHover={{ scale: 1.05, rotateY: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <span className="text-blue-400 mr-3 text-xl"><FaStar /></span>
        <div>
          <p className="text-white font-semibold">
            <strong>Total Stars:</strong> {totalStars}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RepoStarsCounter;