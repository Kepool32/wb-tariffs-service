export interface Tariff {
  warehouseName: string;
  boxDeliveryAndStorageExpr: string;
  boxDeliveryBase: number;
  boxDeliveryLiter: number;
  boxStorageBase: number;
  boxStorageLiter: number;
}

export interface GoogleSheetsResponse {
  data: {
    sheets?: Array<{
      properties?: {
        title?: string;
      };
    }>;
  };
}

export interface DataResponse {
  response: {
    data: {
      warehouseList: Tariff[];
    };
  };
}
