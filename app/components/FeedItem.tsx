import { Heart, MoreVertical, Share2, VolumeX } from 'lucide-preact'
import { Livestream } from '../data.ts'

export const FeedItem = (
  { stream, isActive }: { stream: Livestream; isActive: boolean },
) => {
  return (
    <div class='h-full w-full relative bg-black'>
      {/* Background Image / Video Mock */}
      <img
        src={stream.thumbnail.fullSizeImage || stream.thumbnail.biggerImage}
        class='absolute inset-0 w-full h-full object-cover opacity-90'
        alt={stream.title}
      />

      {/* Right Side Actions */}
      <div class='absolute right-4 bottom-5 flex flex-col items-center space-y-5'>
        <div class=' '>
          <div class='w-12 h-12 rounded-full'>
            <img
              src={stream.user.profileImage.url}
              class='w-full h-full rounded-full '
            />
          </div>
          <div class='flex flex-col items-center'>
            <div class=' bottom-2.5 bg-error  text-[9px] font-bold px-1.5 py-0.5 rounded '>
              LIVE
            </div>
            <span class=' bottom-2.5 text-[10px]'>{stream.activeViewers}</span>
          </div>
        </div>

        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <Share2 class='w-6 h-6' />
          </div>
        </button>
        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <VolumeX class='w-6 h-6' />
          </div>
        </button>
        <button class='flex flex-col items-center text-white'>
          <div class='p-2.5 drop-shadow-lg'>
            <MoreVertical class='w-6 h-6' />
          </div>
        </button>
      </div>

      {/* Bottom Info */}
      <div class='absolute left-4 bottom-5 right-20 '>
        <div class='flex items-center space-x-2 mb-2'>
          <h2 class='font-bold text-lg drop-shadow-md'>
            {stream.user.username}
          </h2>
          <button class='bg-base-100/40 backdrop-blur-md px-3 py-1 card flex-row text-xs font-bold  items-center '>
            <Heart class='w-3 h-3 mr-1' /> Follow
          </button>
        </div>
        <p class='text-sm line-clamp-2 mb-3 drop-shadow-md opacity-90'>
          {stream.title}
        </p>
        <div class='flex flex-wrap gap-2'>
          {stream.livestreamCategories.map((cat: any) => (
            <span
              key={cat.id}
              class='bg-base-100/40 backdrop-blur-md text-xs px-2 py-1 card font-medium'
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
