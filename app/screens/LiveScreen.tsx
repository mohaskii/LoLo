import { Livestream } from '../data.ts'
import {
  Gift,
  ShoppingBag,
  X,
  Share2,
  MoreHorizontal,
  ChevronRight,
} from 'lucide-preact'
import { useEffect, useRef, useState } from 'preact/hooks'

export const LiveScreen = ({
  stream,
  onClose,
}: {
  stream: Livestream
  onClose: () => void
}) => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'alex_99', text: 'Loolu rafet na lool! 🔥', isHost: false },
    { id: 2, user: 'sarah.j', text: 'Ñaata la?', isHost: false },
    { id: 3, user: stream.user.username, text: 'Dalaal na leen yépp! Deniou wanter nak ', isHost: true },
    { id: 4, user: 'mike_collector', text: 'Mën nga wone ginnaaw gi?', isHost: false },
  ])

  // Mock incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const mockTexts = ['Wow!', 'I need this.', 'Is this still available?', 'Nice condition!', '❤️❤️❤️']
      const mockUsers = ['user123', 'collector_pro', 'jane_doe', 'hype_beast']
      
      const newMsg = {
        id: Date.now(),
        user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        text: mockTexts[Math.floor(Math.random() * mockTexts.length)],
        isHost: false,
      }
      setMessages((prev) => [...prev.slice(-15), newMsg])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div class='fixed inset-0 z-50 bg-black flex flex-col text-white'>
      {/* Background Media */}
      <img
        src={stream.thumbnail.fullSizeImage || stream.thumbnail.biggerImage}
        class='absolute inset-0 w-full h-full object-cover opacity-80'
        alt={stream.title}
      />

      {/* Top Header */}
      <div class='relative z-10 flex items-center justify-between p-4 pt-12 bg-gradient-to-b from-black/60 to-transparent'>
        <div class='flex items-center bg-black/40 backdrop-blur-md rounded-full pr-3 pl-1 py-1'>
          <img
            src={stream.user.profileImage.url}
            class='w-8 h-8 rounded-full border border-primary mr-2'
          />
          <div class='flex flex-col'>
            <span class='text-xs font-bold'>{stream.user.username}</span>
            <span class='text-[10px] text-gray-300'>{stream.activeViewers} viewers</span>
          </div>
          <button class='ml-3 bg-primary text-primary-content text-[10px] font-bold px-3 py-1 rounded-full'>
            Follow
          </button>
        </div>

        <div class='flex items-center space-x-3'>
          <div class='bg-black/40 backdrop-blur-md p-2 rounded-full flex items-center justify-center'>
            <span class='w-2 h-2 rounded-full bg-error mr-1.5 animate-pulse' />
            <span class='text-xs font-bold uppercase'>Live</span>
          </div>
          <button onClick={onClose} class='bg-black/40 backdrop-blur-md p-2 rounded-full'>
            <X class='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* spacer to push everything to bottom */}
      <div class='flex-1 relative z-10' />

      {/* Store Highlight / Current Item Preview */}
      <div class='relative z-10 px-4 mb-4'>
        <div class='bg-black/50 backdrop-blur-xl p-2.5 rounded-2xl flex items-center space-x-3 w-full max-w-[280px] border border-white/20 shadow-2xl'>
          <div class='relative'>
            <img src={stream.thumbnail.smallImage} class='w-14 h-14 rounded-xl object-cover border border-white/10' />

          </div>
          <div class='flex flex-col flex-1'>
            <span class='text-sm font-bold text-white leading-tight line-clamp-1'>Escarpins Mashallah</span>
            <span class='text-sm font-black text-primary mt-0.5'>12.000 FCFA</span>
          </div>
          <button class='bg-primary hover:bg-primary-focus text-black text-xs font-black px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(255,215,0,0.5)] transform transition-transform active:scale-95 uppercase tracking-wider'>
            Acheter
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        class='relative z-10 h-48 px-4 overflow-y-auto scrollbar-hide flex flex-col space-y-2 mb-4 mask-image-to-t'
        style={{ maskImage: 'linear-gradient(to top, black 80%, transparent)' }}
      >
        {messages.map((msg) => (
          <div key={msg.id} class='flex flex-col text-sm max-w-[80%]'>
            <div class='bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5 inline-block border border-white/5'>
              <span class={`font-bold mr-2 ${msg.isHost ? 'text-primary' : 'text-gray-300'}`}>
                {msg.user}
                {msg.isHost && <span class='ml-1 text-[10px] bg-primary/20 text-primary px-1 rounded'>Host</span>}
              </span>
              <span class='text-white'>{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar Controls */}
      <div class='relative z-10 flex items-center justify-between px-4 pb-8 pt-2 bg-gradient-to-t from-black/80 to-transparent'>
        <button class='bg-black/40 backdrop-blur-md flex-1 text-left px-4 py-2.5 rounded-full text-sm text-gray-300 border border-white/10 mr-3'>
          Add a comment...
        </button>

        <div class='flex items-center space-x-3'>

          <button class='bg-black/40 backdrop-blur-md p-2.5 rounded-full border border-white/10'>
            <Share2 class='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  )
}
