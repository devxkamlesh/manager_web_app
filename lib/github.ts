import { Octokit } from '@octokit/rest'

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken?: string) {
    this.octokit = new Octokit({
      auth: accessToken,
    })
  }

  async getUserRepos(username: string) {
    try {
      const { data } = await this.octokit.rest.repos.listForUser({
        username,
        sort: 'updated',
        per_page: 50,
      })
      return data
    } catch (error) {
      console.error('Error fetching user repos:', error)
      return []
    }
  }

  async getRepoCommits(owner: string, repo: string, since?: string) {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        since,
        per_page: 100,
      })
      return data
    } catch (error) {
      console.error('Error fetching repo commits:', error)
      return []
    }
  }

  async getUserCommitActivity(username: string, since?: Date) {
    try {
      const repos = await this.getUserRepos(username)
      let totalCommits = 0
      
      for (const repo of repos.slice(0, 10)) { // Limit to recent 10 repos
        const commits = await this.getRepoCommits(
          repo.owner.login, 
          repo.name, 
          since?.toISOString()
        )
        totalCommits += commits.length
      }
      
      return totalCommits
    } catch (error) {
      console.error('Error calculating commit activity:', error)
      return 0
    }
  }

  async getRepoIssues(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        per_page: 50,
      })
      return data
    } catch (error) {
      console.error('Error fetching repo issues:', error)
      return []
    }
  }

  async createIssue(owner: string, repo: string, title: string, body?: string) {
    try {
      const { data } = await this.octokit.rest.issues.create({
        owner,
        repo,
        title,
        body,
      })
      return data
    } catch (error) {
      console.error('Error creating issue:', error)
      throw error
    }
  }
}