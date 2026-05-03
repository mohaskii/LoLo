import {
  Home,
  LucideIcon,
  MessageSquare,
  Plus,
  Search,
  User,
} from 'lucide-preact'

const TabItem = ({ icon: Icon, label, active = false, onClick }: {
  icon: LucideIcon
  label: string
  active?: boolean
  onClick?: () => void
}) => {
  return (
    <div
      onClick={onClick}
      class={`flex text-xs flex-col items-center w-16 ${
        active && 'text-primary '
      }`}
    >
      <Icon strokeWidth={4} />
      <span class='mt-1  text-[10px]'>{label}</span>
    </div>
  )
}

export const BottomNavBar = ({ onSellClick }: { onSellClick?: () => void }) => {
  return (
    <div class='flex justify-around items-center bg-base-100 py-2 '>
      <TabItem icon={Home} active label='Accueil' />
      <TabItem icon={Search} label='Rechercher' />
      <TabItem icon={Plus} label='Vendre' onClick={onSellClick} />
      <TabItem icon={MessageSquare} label='Messages' />
      <TabItem icon={User} label='Profil' />
    </div>
  )
}
