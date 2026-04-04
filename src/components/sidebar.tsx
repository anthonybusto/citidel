import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  { path: '/mayor', label: 'Mayor Chat' },
  { path: '/workers', label: 'Workers' },
  { path: '/infra', label: 'Infrastructure' },
  { path: '/beads', label: 'Beads' },
  { path: '/rigs', label: 'Rigs' },
  { path: '/refinery', label: 'Refinery' },
  { path: '/mail', label: 'Mail' },
  { path: '/convoys', label: 'Convoys' },
  { path: '/hooks', label: 'Hooks' },
  { path: '/molecules', label: 'Molecules' },
  { path: '/wisps', label: 'Wisps' },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-56',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-border px-4">
        {!collapsed && <span className="text-lg font-bold tracking-tight">CITADEL</span>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '>' : '<'}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )
            }
          >
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-border p-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
            )
          }
        >
          {!collapsed && 'Settings'}
        </NavLink>
      </div>
    </aside>
  )
}
