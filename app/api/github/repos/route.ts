import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GitHubService } from '@/lib/github'
import { cacheGet, cacheSet } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')
    
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }

    // Check cache first
    const cacheKey = `github:repos:${username}`
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Fetch from GitHub
    const github = new GitHubService()
    const repos = await github.getUserRepos(username)
    
    // Cache for 1 hour
    await cacheSet(cacheKey, repos, 3600)
    
    return NextResponse.json(repos)
  } catch (error) {
    console.error('GitHub repos API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}