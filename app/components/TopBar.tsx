import { Bell } from 'lucide-preact'

export const TopBar = () => {
  return (
    <div>
      <div class='flex justify-between items-center px-4 py-3  '>
        <div class='flex space-x-6 relative'>
          <div class='relative'>
            <span class='text-xl font-bold opacity-70'>Suivie</span>
          </div>
          <div class='relative'>
            <span class='text-xl font-bold '>Pour Toi</span>
            <div class='absolute bottom-0 left-0 right-0 h-0.5 bg-base-content' />
          </div>
        </div>
        <Bell strokeWidth={4} class='w-6 h-6 ' />
      </div>
      <div class='flex overflow-x-auto scrollbar-hide px-4 py-2 space-x-3'>
        <div class='bg-primary text-primary-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Tout
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Vêtements
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Électronique
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs    text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Maison & Jardin
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Véhicules
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Livres & Médias
        </div>
        <div class='bg-base-300/60 backdrop-blur-xs   text-base-content px-4 py-1.5 card text-sm font-medium whitespace-nowrap'>
          Services
        </div>
      </div>
    </div>
  )
}
