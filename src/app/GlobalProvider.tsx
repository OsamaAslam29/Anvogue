import React from 'react'
import { ModalCartProvider } from '@/context/ModalCartContext'
import { ModalWishlistProvider } from '@/context/ModalWishlistContext'
import { ModalCompareProvider } from '@/context/ModalCompareContext'
import { ModalSearchProvider } from '@/context/ModalSearchContext'
import { ModalQuickviewProvider } from '@/context/ModalQuickviewContext'
import { ModalEMIProvider } from '@/context/ModalEMIContext'

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ModalCartProvider>
            <ModalWishlistProvider>
                <ModalCompareProvider>
                    <ModalSearchProvider>
                        <ModalQuickviewProvider>
                            <ModalEMIProvider>
                                {children}
                            </ModalEMIProvider>
                        </ModalQuickviewProvider>
                    </ModalSearchProvider>
                </ModalCompareProvider>
            </ModalWishlistProvider>
        </ModalCartProvider>
    )
}

export default GlobalProvider