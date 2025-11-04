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
    "updatedAt": "2025-11-04T18:23:53.081Z",
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

// Helper function to transform simple EMI array to bank structure
const transformEMIData = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Check if data already has bank structure (has bankName and EMIDetails)
  const firstItem = data[0];
  if (firstItem.bankName && firstItem.EMIDetails) {
    return data; // Already in bank structure
  }

  // Check if it's a simple array of EMI details
  if (firstItem.noOfEMIs !== undefined && firstItem.convenienceFeeInPercentage !== undefined) {
    // Transform simple EMI array to bank structure
    return [
      {
        "_id": "default-bank",
        "bankName": "EMI Options",
        "EMIDetails": data,
        "createdAt": new Date().toISOString(),
        "updatedAt": new Date().toISOString(),
        "__v": 0
      }
    ];
  }

  return data; // Return as is if structure is unknown
};

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
        // Transform data if needed (handle both bank structure and simple EMI array)
        const transformedData = transformEMIData(result);
        dispatch(emiActions.setEMIBanks(transformedData));
      } else {
        // If API fails, use mock data
        dispatch(emiActions.setEMIBanks(mockEMIData));
      }
    } catch (err) {
      // If there's any error, use mock data
      dispatch(emiActions.setEMIBanks(mockEMIData));
    }
    
    dispatch(emiActions.setLoading(false));
    return [true, null];
  },
};

export default EMIService;