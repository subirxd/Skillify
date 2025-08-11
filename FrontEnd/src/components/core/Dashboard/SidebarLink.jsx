import React from 'react'
import * as Icons from "react-icons/vsc"
import { matchPath, NavLink, useLocation } from 'react-router-dom'

function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      className={`relative px-6 py-2 text-sm font-medium flex items-center gap-x-2
        transition-all duration-200 rounded-md
        ${isActive ? "bg-yellow-800 text-yellow-50" : "text-richblack-300 hover:bg-richblack-700 hover:text-yellow-50"}
      `}
    >
      {/* Active yellow bar */}
      <span
        className={`absolute left-0 top-0 h-full w-[3px] rounded-r-md bg-yellow-50 transition-opacity duration-300
        ${isActive ? "opacity-100" : "opacity-0"}`}
      ></span>

      <Icon className="text-lg" />
      <span>{link.name}</span>
    </NavLink>
  )
}

export default SidebarLink
