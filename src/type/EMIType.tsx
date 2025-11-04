export interface EMIDetail {
  _id: string;
  noOfEMIs: number;
  convenienceFeeInPercentage: number;
  pricePerMonth: number;
  price: number;
  convenienceFeeInPrice: number;
  totalPrice: number;
}

export interface EMIBank {
  _id: string;
  bankName: string;
  EMIDetails: EMIDetail[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EMIState {
  emiBanks: EMIBank[];
  selectedBank: EMIBank | null;
  selectedEMI: EMIDetail | null;
  isLoading: boolean;
  error: string | null;
}