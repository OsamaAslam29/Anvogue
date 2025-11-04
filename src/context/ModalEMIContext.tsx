'use client'

import React, { createContext, useContext, useState } from 'react'

interface ModalEMIContextType {
  isModalOpen: boolean
  openModalEMI: () => void
  closeModalEMI: () => void
}

const ModalEMIContext = createContext<ModalEMIContextType | undefined>(undefined)

export const ModalEMIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModalEMI = () => {
    setIsModalOpen(true)
  }

  const closeModalEMI = () => {
    setIsModalOpen(false)
  }

  return (
    <ModalEMIContext.Provider value={{ isModalOpen, openModalEMI, closeModalEMI }}>
      {children}
    </ModalEMIContext.Provider>
  )
}

export const useModalEMIContext = () => {
  const context = useContext(ModalEMIContext)
  if (context === undefined) {
    throw new Error('useModalEMIContext must be used within a ModalEMIProvider')
  }
  return context
}