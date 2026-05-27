'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Heart, Share2, Repeat2, Users } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'

const MOCK_FEED = [
  {
    id: '1',
    username: 'chaotic.creative',
    avatar: '🦋',
    tool: 'Personality Scanner',
    tool_emoji: '🧠',
    content: 'ENFP chaos goblin with main character syndrome and surprisingly good taste',
    likes: 2847,
    gradient: 'from-violet-500 to-blue-500',
    time: '2m ago',
  },
  {
    id: '2',
    username: 'midnight.coder',
    avatar: '🌙',
    tool: 'AI Roast Me',
    tool_emoji: '🔥',
    content: '"You have the energy of someone who starts 17 projects and finishes 0.5 of them" 💀',
    likes: 4201,
    gradient: 'from-orange-500 to-red-500',
    time: '5m ago',
  },
  {
    id: '3',
    username: 'golden.era',
    avatar: '⭐',
    tool: 'Aura Detector',
    tool_emoji: '✨',
    content: 'Electric violet aura with sapphire undertones. Pure creative chaos wrapped in calm.',
    likes: 1923,
    gradient: 'from-cyan-500 to-teal-500',
    time: '12m ago',
  },
  {
    id: '4',
    username: 'future.founder',
    avatar: '🚀',
    tool: 'Future Self AI',
    tool_emoji: '🔮',
    content: 'In 10 years: Founder of 3 companies, 2 languages learned, one TED talk given',
    likes: 3156,
    gradient: 'from-blue-500 to-indigo-500',
    time: '18m ago',
  },
  {
    id: '5',
    username: 'viral.queen',
    avatar: '👑',
    tool: 'Creator Toolkit',
    tool_emoji: '🎨',
    content: '"The type of creator who trends accidentally while just being authentic"',
    likes: 5892,
    gradient: 'from-pink-500 to-violet-500',
    time: '24m ago',
  },
  {
    id: '6',
    username: 'deep.thinker',
    avatar: '🌊',
    tool: 'Personality Scanner',
    tool_emoji: '🧠',
    content: 'INTJ galaxy brain. Sees patterns no one else does. Chronically online but make it philosophical.',
    likes: 2341,
    gradient: 'from-violet-500 to-blue-500',
    time: '31m ago',
  },
]

export function CommunityFeed() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section ref={ref} className="py-20 sm:py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Users className="w-3.5 h-3.5" />
            Live Community Feed
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            See what people are{' '}
            <span className="gradient-text">discovering</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real people. Share yours and watch it go viral.
          </p>
        </motion.div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_FEED.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              inView={inView}
              liked={likedPosts.has(item.id)}
              onLike={() => toggleLike(item.id)}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Join <span className="text-foreground font-semibold">500,000+</span> people sharing their AI results
          </p>
          <div className="flex -space-x-2 justify-center">
            {['🦋', '⭐', '🌙', '🚀', '👑', '🌊', '🎨', '🔥'].map((emoji, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-background bg-card flex items-center justify-center text-sm"
              >
                {emoji}
              </div>
            ))}
            <div className="w-9 h-9 rounded-full border-2 border-background bg-primary text-white flex items-center justify-center text-xs font-bold">
              +
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function FeedCard({
  item,
  index,
  inView,
  liked,
  onLike,
}: {
  item: typeof MOCK_FEED[0]
  index: number
  inView: boolean
  liked: boolean
  onLike: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="glass border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group"
    >
      {/* User */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center text-base">
            {item.avatar}
          </div>
          <div>
            <div className="text-sm font-medium">@{item.username}</div>
            <div className="text-xs text-muted-foreground">{item.time}</div>
          </div>
        </div>
        <div className={cn(
          'text-xs px-2.5 py-1 rounded-full flex items-center gap-1',
          `bg-gradient-to-r ${item.gradient}`,
          'text-white font-medium'
        )}>
          {item.tool_emoji} {item.tool}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed text-foreground/90 mb-5">
        "{item.content}"
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors group/like"
          >
            <Heart className={cn(
              'w-4 h-4 transition-all group-hover/like:scale-125',
              liked && 'fill-red-400 text-red-400'
            )} />
            {liked ? item.likes + 1 : item.likes}
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Repeat2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <button className="text-xs text-primary hover:underline font-medium">
          Try this tool →
        </button>
      </div>
    </motion.div>
  )
}
