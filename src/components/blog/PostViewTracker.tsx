'use client'

import { useEffect } from 'react'

import { incrementPostView } from '@/app/blog/actions'

interface PostViewTrackerProps {
  postId: string
}

export function PostViewTracker({ postId }: PostViewTrackerProps) {
  useEffect(() => {
    const key = `afluar:viewed:${postId}`

    if (sessionStorage.getItem(key) === '1') {
      return
    }

    sessionStorage.setItem(key, '1')
    void incrementPostView({ post_id: postId })
  }, [postId])

  return null
}
