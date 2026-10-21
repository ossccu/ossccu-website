import { GitHubStats } from "@/types/project";

// In-memory cache for fast lookup and avoiding GitHub REST API rate-limits
const memoryCache = new Map<string, { stats: GitHubStats; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_PREFIX = "ossccu_gh_repo_";

export function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  if (!url || typeof url !== "string") return null;

  try {
    // Clean string and strip trailing slashes or .git
    let cleaned = url.trim().replace(/\.git$/, "").replace(/\/+$/, "");

    // Add protocol if missing for URL parsing
    if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
      cleaned = `https://${cleaned}`;
    }

    const parsed = new URL(cleaned);
    if (!parsed.hostname.includes("github.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    // Invalid URL format
  }

  return null;
}

export async function fetchGitHubStats(url: string): Promise<GitHubStats> {
  const repoInfo = parseGitHubRepo(url);
  if (!repoInfo) {
    return { stars: 0, forks: 0, loaded: false };
  }

  const key = `${repoInfo.owner.toLowerCase()}/${repoInfo.repo.toLowerCase()}`;

  // 1. Check in-memory cache
  const inMemory = memoryCache.get(key);
  if (inMemory && Date.now() - inMemory.timestamp < CACHE_TTL_MS) {
    return inMemory.stats;
  }

  // 2. Check localStorage cache
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          memoryCache.set(key, parsed);
          return parsed.stats;
        }
      }
    } catch {
      // Storage failure fallback
    }
  }

  // 3. Fetch from GitHub REST API
  try {
    const res = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!res.ok) {
      // Could be 403 rate-limited, 404 private repo, etc.
      const fallback: GitHubStats = { stars: 0, forks: 0, loaded: false };
      return fallback;
    }

    const data = await res.json();
    const stats: GitHubStats = {
      stars: typeof data.stargazers_count === "number" ? data.stargazers_count : 0,
      forks: typeof data.forks_count === "number" ? data.forks_count : 0,
      openIssues: data.open_issues_count,
      language: data.language,
      loaded: true,
    };

    const entry = { stats, timestamp: Date.now() };
    memoryCache.set(key, entry);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(entry));
      } catch {
        // LocalStorage quota or access error
      }
    }

    return stats;
  } catch (err) {
    console.debug(`GitHub API lookup omitted for ${key}:`, err);
    return { stars: 0, forks: 0, loaded: false };
  }
}
