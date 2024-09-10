import React, { useState, useEffect, useMemo } from 'react';

interface Repo {
  name: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  size: number;
}

const languageColors: { [key: string]: string } = {
  JavaScript: '#f1e05a',
  TypeScript: '#2b7489',
  Python: '#3572A5',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#F18E33',
  Dart: '#00B4AB',
};

const RepoCard: React.FC<{ repo: Repo }> = ({ repo }) => {
  const [languageData, setLanguageData] = useState<{ [key: string]: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(repo.languages_url)
      .then((response) => response.json())
      .then((data) => {
        // Check if data contains the expected format
        if (data && typeof data === 'object') {
          setLanguageData(data);
        } else {
          console.error('Unexpected language data format:', data);
          setLanguageData(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching language data:', error);
        setLoading(false);
      });
  }, [repo.languages_url]);

  const totalBytes = languageData ? Object.values(languageData).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 m-2 w-72 transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer">
      <h3 className="font-semibold text-lg">{repo.name}</h3>
      <div className="flex items-center mt-2">
        <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 15.27L16.18 19 14.54 12.97 20 8.64l-7.19-.61L10 2 7.19 8.03 0 8.64l5.46 4.33L3.82 19z" />
        </svg>
        <span>{repo.stargazers_count} Stars</span>
      </div>
      <div className="flex items-center mt-1">
        <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 18.42l-6.3-6.3A8.7 8.7 0 010 10.6c0-4.8 3.9-8.6 8.7-8.6 4.3 0 8.3 3.1 8.3 8.3 0 2.3-.8 4.3-2.3 5.9l6.3 6.3z" />
        </svg>
        <span>{repo.forks_count} Forks</span>
      </div>
      <div className="mt-4">
        {loading ? (
          <p className="text-gray-500">Loading languages...</p>
        ) : (
          languageData && (
            <div className="mt-2">
              <h3 className="font-semibold mb-1">Languages:</h3>
              {Object.entries(languageData).map(([lang, bytes]) => {
                const percentage = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : 0;
                return (
                  <div key={lang} className="flex justify-between">
                    <span className="flex items-center">
                      <span
                        className="inline-block w-2 h-2 mr-1 rounded-full"
                        style={{ backgroundColor: languageColors[lang] || '#2b2b2b' }}
                      />
                      {lang}
                    </span>
                    <span>{percentage}%</span>
                  </div>
                );
              })}
              <p className="mt-2">Total Size: {repo.size} KB</p>
              <p className="mt-1">Created: {new Date(repo.created_at).toLocaleDateString()}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

const RepoList: React.FC<{ repos: Repo[] }> = ({ repos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => repo.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [repos, searchTerm]);

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="text"
        placeholder="Search repositories..."
        className="mb-4 p-2 border rounded-lg w-80"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-wrap justify-center">
        {filteredRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
};

const CodeForest: React.FC<{ repos: Repo[] }> = ({ repos }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <h1 className="text-center text-3xl p-4">Developer Repositories</h1>
      <RepoList repos={repos} />
    </div>
  );
};

export default CodeForest;
