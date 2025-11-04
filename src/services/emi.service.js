import { emiActions } from "@/redux/slices/emiSlice";
import http from "./http.service";
import Promisable from "./promisable.service";

// Mock data for testing
const mockEMIData = [
  {
    "_id": "69099b3fbb8224bcee503a45",
    "bankName": "Emmanuel Pennington",
    "EMIDetails": [
      {
        "noOfEMIs": 14,
        "convenienceFeeInPercentage": 10,
        "pricePerMonth": 528,
        "price": 680,
        "convenienceFeeInPrice": 408,
        "totalPrice": 686,
        "_id": "69099b3fbb8224bcee503a46"
      },
      {
        "noOfEMIs": 16,
        "convenienceFeeInPercentage": 12,
        "pricePerMonth": 1333,
        "price": 2322,
        "convenienceFeeInPrice": 2222,
        "totalPrice": 222222,
        "_id": "69099b3fbb8224bcee503a47"
      }
    ],
    "createdAt": "2025-11-04T06:20:47.854Z",
    "updatedAt": "2025-11-04T06:20:47.854Z",
    "__v": 0
  },
  {
    "_id": "6902239649315055144a5eee",
    "bankName": "Punjab Bank",
    "EMIDetails": [
      {
        "noOfEMIs": 12,
        "convenienceFeeInPercentage": 2,
        "pricePerMonth": 12,
        "price": 1,
        "convenienceFeeInPrice": 21,
        "totalPrice": 122000,
        "_id": "6902239649315055144a5eef"
      },
      {
        "noOfEMIs": 24,
        "convenienceFeeInPercentage": 2,
        "pricePerMonth": 12,
        "price": 1,
        "convenienceFeeInPrice": 21,
        "totalPrice": 122000,
        "_id": "6902239649315055144a5ef0"
      }
    ],
    "createdAt": "2025-10-29T14:24:22.280Z",
    "updatedAt": "2025-10-29T17:09:17.888Z",
    "__v": 0
  }
];

const EMIService = {
  getAll: async (dispatch) => {
    dispatch(emiActions.setLoading(true));
    
    try {
      // Try to fetch from API first
      const [success, error] = await Promisable.asPromise(
        http.get(`emi/all`)
      );

      if (success) {
        const { result } = success.data;
        dispatch(emiActions.setEMIBanks(result));
      } else {
        // If API fails, use mock data
        console.log('API failed, using mock data');
        dispatch(emiActions.setEMIBanks(mockEMIData));
      }
    } catch (err) {
      // If there's any error, use mock data
      console.log('Using mock EMI data');
      dispatch(emiActions.setEMIBanks(mockEMIData));
    }
    
    dispatch(emiActions.setLoading(false));
    return [true, null];
  },
};

export default EMIService;