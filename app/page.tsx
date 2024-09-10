'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from '../components/gh/ProfileHeader';
import ProfileSummary from '../components/gh/ProfileSummary';
import Statistics from '../components/gh/Statistics';
import ErrorMessage from '../components/gh/ErrorMessage';
import ProfileFetcher from '../components/gh/ProfileFetcher';
import RepoStarsCounter from '../components/gh/RepoStarsCounter';
import UserSince from '../components/gh/UserSince';
import ContributionCarousel from '../components/gh/ContributionCarousel';
import Contributions from '../components/gh/Contributions';
import CodeForest from '../components/gh/CodeForest';

interface Repo {
  name: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  size: number;
}

interface ProfileData {
  name: string;
  bio: string;
  repoCount: number;
  followers: number;
  following: number;
  location: string;
  htmlUrl: string;
  avatarUrl: string;
  createdAt: string;
  gistsCount: number;
  company: string;
  hireable: boolean;
  email: string | null;
  links: string[]; // Array to store all links
  repos: Repo[];
  contributions: {
    total: { [year: string]: number };
    contributions: Array<{ date: string; count: number; level: number }>;
  };
}

const Home = () => {
  const [profileUrl, setProfileUrl] = useState('');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  useEffect(() => {
    if (fetchSuccess) {
      const timer = setTimeout(() => setFetchSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [fetchSuccess]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const username = profileUrl.split('github.com/')[1];
  
      if (!username) {
        throw new Error('Invalid GitHub profile URL');
      }
  
      const response = await axios.get(`/api/github-data?username=${username}`);
      console.log('API Response:', response.data);
  
      const { user, repos, contributions } = response.data;
  
      setProfileData({
        name: user.name || 'N/A',
        bio: user.bio || 'No bio available',
        repoCount: user.public_repos,
        gistsCount: user.public_gists,
        followers: user.followers,
        following: user.following,
        location: user.location || 'N/A',
        company: user.company || 'N/A',
        htmlUrl: user.html_url,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
        hireable: user.hireable,
        repos: repos.map((repo: any) => ({
          name: repo.name,
          languages_url: repo.languages_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          created_at: repo.created_at,
          size: repo.size,
        })),
        email: user.email || null,
        contributions: response.data.contributions,
        links: [], // You'll need to process this based on the actual data structure
      });
      console.log("Profile data set:", profileData);
      setFetchSuccess(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile data');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };


  

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-gradient-to-b from-gray-900 to-gray-800">
      
      <motion.h1 
        className="text-5xl font-bold text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        GitHub Profile Explorer
      </motion.h1>
      
      <ProfileFetcher 
        profileUrl={profileUrl} 
        setProfileUrl={setProfileUrl} 
        fetchProfileData={fetchProfileData}
        loading={loading}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage message={error} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loader mt-8"
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="loader-inner" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fetchSuccess && (
          <motion.div
            className="text-green-400 mt-4 text-lg font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            Profile fetched successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
     
        {profileData && profileData.contributions && profileData.repos && (
          <motion.div 
            className="mt-8 p-6 border border-gray-700 rounded-lg text-left bg-gray-800 shadow-xl w-full max-w-3xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileHeader 
              name={profileData.name} 
              avatarUrl={profileData.avatarUrl} 
              htmlUrl={profileData.htmlUrl} 
            />
            <ProfileSummary 
              bio={profileData.bio} 
              location={profileData.location} 
              company={profileData.company} 
              userSince={<UserSince createdAt={profileData.createdAt} />} 
              hireable={profileData.hireable} 
              email={profileData.email} 
              links={profileData.links} 
            />
            <Statistics 
              repoCount={profileData.repoCount} 
              gistsCount={profileData.gistsCount} 
              followers={profileData.followers} 
              following={profileData.following} 
            />
            <RepoStarsCounter repos={profileData.repos} />
            <ContributionCarousel contributions={profileData.contributions} />
            <Contributions contributions={profileData.contributions} />
            <h2 className="text-2xl font-bold text-white mb-4">Repository Forest</h2>
            <CodeForest repos={profileData.repos} />
        {/*  
           <CodeGenome username={profileUrl.split('github.com/')[1]} /> 
<CodeGenome 
              repos={profileData.repos} 
              username={profileUrl.split('github.com/')[1]} 
            />
           
        */}
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
