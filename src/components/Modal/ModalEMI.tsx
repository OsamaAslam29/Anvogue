'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store.d'
import { emiActions } from '@/redux/slices/emiSlice'
import EMIService from '@/services/emi.service'
import { EMIBank, EMIDetail } from '@/type/EMIType'

interface ModalEMIProps {
  isOpen: boolean
  onClose: () => void
  productPrice: number
}

const ModalEMI: React.FC<ModalEMIProps> = ({ isOpen, onClose, productPrice }) => {
  const dispatch = useDispatch()
  const { emiBanks, selectedBank, isLoading, error } = useSelector((state: RootState) => state.emi)
  const [expandedEMI, setExpandedEMI] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && emiBanks.length === 0) {
      EMIService.getAll(dispatch)
    }
  }, [isOpen, dispatch, emiBanks.length])

  useEffect(() => {
    if (emiBanks.length > 0 && !selectedBank) {
      dispatch(emiActions.setSelectedBank(emiBanks[0]))
    }
  }, [emiBanks, selectedBank, dispatch])

  const handleBankSelect = (bank: EMIBank) => {
    dispatch(emiActions.setSelectedBank(bank))
    setExpandedEMI(null)
  }

  const toggleEMIExpansion = (emiId: string) => {
    setExpandedEMI(expandedEMI === emiId ? null : emiId)
  }

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`
  }

  if (!isOpen) return null

  return (
    <div className="modal-emi fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-line">
          <div className="flex items-center gap-4">
            <h2 className="heading4">EMI Details</h2>
            <span className="text-red text-sm font-medium">T&C</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Icon.X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content flex h-[calc(90vh-120px)] max-md:flex-col">
          {/* Left Sidebar - Bank List */}
          <div className="bank-list w-80 max-md:w-full border-r border-line overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500">
                <p>{error}</p>
              </div>
            ) : (
              <div className="p-4">
                {emiBanks.map((bank) => (
                  <div
                    key={bank._id}
                    className={`bank-item flex items-center gap-3 p-4 rounded-lg cursor-pointer mb-2 ${
                      selectedBank?._id === bank._id ? 'active' : ''
                    }`}
                    onClick={() => handleBankSelect(bank)}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Icon.Bank size={16} />
                    </div>
                    <span className="text-sm font-medium">{bank.bankName}</span>
                    {selectedBank?._id === bank._id && (
                      <Icon.CaretRight size={16} className="ml-auto text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Content - EMI Details */}
          <div className="emi-details flex-1 overflow-y-auto">
            {selectedBank && (
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-6">{selectedBank.bankName}</h3>
                
                <div className="space-y-4">
                  {selectedBank.EMIDetails.map((emi) => (
                    <div key={emi._id} className="emi-item border border-line rounded-lg">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleEMIExpansion(emi._id)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium">
                            {emi.noOfEMIs} EMIs | Convenience Fee ({emi.convenienceFeeInPercentage}%) {formatCurrency(emi.pricePerMonth)}/m
                          </span>
                        </div>
                        <Icon.CaretDown
                          size={16}
                          className={`transition-transform ${
                            expandedEMI === emi._id ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                      
                      {expandedEMI === emi._id && (
                        <div className="expanded-content px-4 pb-4 border-t border-line bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex justify-between">
                              <span className="text-secondary">Price</span>
                              <span className="font-medium">{formatCurrency(emi.price)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-secondary">Convenience Fee</span>
                              <span className="font-medium">{formatCurrency(emi.convenienceFeeInPrice)}</span>
                            </div>
                            <div className="flex justify-between col-span-1 md:col-span-2 pt-2 border-t border-line">
                              <span className="text-secondary font-medium">Total Amount Payable</span>
                              <span className="font-semibold text-lg">{formatCurrency(emi.totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-line bg-gray-50">
          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Bank Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalEMI