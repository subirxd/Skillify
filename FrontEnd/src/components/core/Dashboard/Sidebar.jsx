import React, { useState } from 'react'
import { dashboardLinks } from "../../../data/dashboard-links"
import { logout } from '../../../Services/operations/authAPI'
import SidebarLink from './SidebarLink'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscSignOut } from 'react-icons/vsc'
import ConfirmationModal from '../../Common/ConfirmationModal'

function Sidebar() {
    const { user, loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [confirmationModal, setConfirmationModal] = useState(null)

    if (profileLoading || authLoading) {
        return <div className='spinner'></div>
    }

    return (
        <div className="flex h-[calc(100vh-3.5rem)] min-w-[240px] flex-col border-r border-richblack-700 bg-richblack-900 py-8">
            
            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
                {dashboardLinks.map((link) => {
                    if (link?.type && user?.accountType !== link?.type) return null
                    return (
                        <SidebarLink
                            link={link}
                            iconName={link.icon}
                            key={link.id}
                        />
                    )
                })}
            </div>

            {/* Divider */}
            <div className='my-6 h-px w-10/12 mx-auto bg-richblack-600'></div>

            {/* Settings & Logout */}
            <div className="flex flex-col gap-1">
                <SidebarLink
                    link={{ name: "Settings", path: "dashboard/settings" }}
                    iconName={"VscSettingsGear"}
                />

                <button
                    onClick={() =>
                        setConfirmationModal({
                            text1: "Are you sure?",
                            text2: "You will be logged out.",
                            btn1Text: "Logout",
                            btn2Text: "Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })
                    }
                    className="px-8 py-2 text-sm font-medium text-richblack-300 hover:bg-richblack-700 transition-all rounded-md"
                >
                    <div className='flex items-center gap-x-2'>
                        <VscSignOut className='text-lg' />
                        <span>Logout</span>
                    </div>
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </div>
    )
}

export default Sidebar
