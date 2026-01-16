'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge';



export function DetailPopup({ item, onClose }: any) {
  const [isOpen, setIsOpen] = useState(false)

  // <CHANGE> Handle when item changes - animate in/out
  useEffect(() => {
    setIsOpen(!!item)
  }, [item])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }
  const getStatusColor = (status: boolean) => {
    switch (status) {
      case false:
        return 'bg-yellow-500 text-white';
      case true:
        return 'bg-green-500 text-white';

    }
  };

  return (
    <>
      {/* <CHANGE> Overlay backdrop */}
      {item && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* <CHANGE> Left-side popup with slide animation */}
      <div
        className={`fixed left-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-lg z-50 overflow-y-auto transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-xl font-bold">User Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {item && (
          <div className="p-6 space-y-6">
            {/* <CHANGE> Profile section */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                UISER INFORMATION
              </h3>
              <div className="space-y-4 ">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-foreground font-medium mt-1">{item.full_name}</p>
                </div>
                 <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-foreground font-medium mt-1">{item.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium mt-1">{item.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">National Id</p>
                  <p className="text-foreground font-medium mt-1">{item.national_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p className="text-foreground font-medium mt-1">{item.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User Type</p>
                  <p className="text-foreground font-medium mt-1">{item.user_type}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                 <Badge className="bg-green-500 text-white">{item.status}</Badge> 
                </div>

              </div>
            </div>

            {/* <CHANGE> Work section */}
           

            {/* <CHANGE> Additional info section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                ADDITIONAL INFORMATION
              </h3>
              <div className="space-y-4 grid grid-cols-2 gap-3 text-start">

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email Verified</p>
                  {/* <p className="text-foreground mt-1 text-sm leading-relaxed">{item.is_operational ? ("true") : ("false")}</p> */}
                  <Badge className={`${getStatusColor(item.email_verified)} text-white text-xs font-medium px-2 py-0 rounded-md h-[30px] flex items-center`}>
                    {item.email_verified ? ("true") : ("false")}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Verified</p>
                  {/* <p className="text-foreground mt-1 text-sm leading-relaxed">{item.is_in_maintenance ? ("true") : ("false")}</p> */}
                   <Badge className={`${getStatusColor(item.phone_verified)} text-white text-xs font-medium px-2 py-1 rounded-md h-[30px] flex items-center`}>
                    {item.phone_verified ? ("true") : ("false")}
                  </Badge>
                </div>
                
              </div>
            </div>

            {/* <CHANGE> Action buttons */}
            <div className="border-t border-border pt-6 flex gap-3">

              <Button variant="outline" className="flex-1 text-white font-medium
                                        rounded-[14px]
                                        px-5 py-2
                                        bg-gradient-to-r from-[#0F90EE] to-[#276CCC]
                                        hover:opacity-90
                                        shadow-md" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}