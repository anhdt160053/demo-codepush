import { ApisauceInstance, ApiResponse } from "apisauce"
import { Storage, StorageKey } from "../storage/index"

export class UserApi {
  private _apisauce: ApisauceInstance
  private _storage = new Storage()
  constructor(apisauce: ApisauceInstance) {
    this._apisauce = apisauce
  }

  async login(payload: any): Promise<any> {
    const response = await this._apisauce.post(`/api/auth`, payload)
    return response
  }

  async getDetailDashboard(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN);
    const response = await this._apisauce.post(`/api/asset/getDataAssetDetail`, payload,
      { headers: { "Authorization": `Bearer ${accessToken}` } }) 
    return response.data
  }

  async getMasterDataAssetForm(payload: any): Promise<any> {
    const accessToken = await this._storage.getItem(StorageKey.JWT_TOKEN);
    const response = await this._apisauce.post(`/api/asset/getMasterDataAssetForm`, payload , 
      { headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json"
     } })
    return response.data
  }


  // async taoPhanBoTaiSan(payload: any): Promise<any> {
  //   const accessToken = await this._loft3DiModel?.userInfo?.token;
  //   const response = await this._apisauce.post(`/asset/taoPhanBoTaiSan`, payload,
  //     { headers: { "Authorization": `Bearer ${accessToken}` } })
  //   return response.data
  // }

  // async taoThuHoiTaiSan(payload: any): Promise<any> {
  //   const accessToken = await this._loft3DiModel?.userInfo?.token;
  //   const response = await this._apisauce.post(`/asset/taoThuHoiTaiSan`, payload,
  //     { headers: { "Authorization": `Bearer ${accessToken}` } })
  //   return response.data
  // }

  // async createOrUpdateBaoDuong(payload: any): Promise<any> {
  //   const accessToken = await this._loft3DiModel?.userInfo?.token;
  //   const response = await this._apisauce.post(`/asset/createOrUpdateBaoDuong`, payload,
  //     { headers: { "Authorization": `Bearer ${accessToken}` } })
  //   return response.data
  // }

}


