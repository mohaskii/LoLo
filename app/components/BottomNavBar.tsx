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
      class={`flex text-xs flex-col items-center w-16 cursor-pointer ${
        active ? 'text-primary' : 'text-base-content/70'
      }`}
    >
      <Icon strokeWidth={active ? 3 : 2} />
      <span class={`mt-1 text-[10px] ${active ? 'font-bold' : ''}`}>{label}</span>
    </div>
  )
}

export const BottomNavBar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) => {
  return (
    <div class='flex justify-around items-center bg-base-100 py-2 border-t border-base-200'>
      <TabItem icon={Home} active={activeTab === 'accueil'} label='Accueil' onClick={() => onTabChange('accueil')} />
      <TabItem icon={Search} active={activeTab === 'rechercher'} label='Rechercher' onClick={() => onTabChange('rechercher')} />
      <TabItem icon={Plus} active={activeTab === 'vendre'} label='Vendre' onClick={() => onTabChange('vendre')} />
      <TabItem icon={MessageSquare} active={activeTab === 'messages'} label='Messages' onClick={() => onTabChange('messages')} />
      <TabItem icon={User} active={activeTab === 'profil'} label='Profil' onClick={() => onTabChange('profil')} />
    </div>
  )
}
