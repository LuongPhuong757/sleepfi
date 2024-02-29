import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios, { AxiosRequestConfig } from 'axios'
import * as url from 'url'

@Injectable()
export class WyreClient {
  public baseURL
  public apiKey
  public secretKey
  public account
  public paymentMethod

  constructor(private readonly configService: ConfigService) {
    this.baseURL = this.configService.get<string>('payment.url')
    this.apiKey = this.configService.get<string>('payment.api_key')
    this.secretKey = this.configService.get<string>('payment.secret_key')
    this.account = this.configService.get<string>('payment.account')
    this.paymentMethod = this.configService.get<string>('payment.paymentMethod')
  }

  public async get(path: string, params?: any, options?: any): Promise<any> {
    try {
      const requestOptions = this.buildRequestOptions(
        'GET',
        path,
        params,
        options
      )
      const resultData = await axios.get(requestOptions.url, requestOptions)
      return {
        status: 'success',
        data: resultData.data
      }
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.message ?? 'Wyre payout handle error'
      )
    }
  }

  public async post(path: string, body?: any, options?: any): Promise<any> {
    try {
      const requestOptions = this.buildRequestOptions(
        'POST',
        path,
        body,
        options
      )
      const resultData = await axios.post(
        requestOptions.url,
        requestOptions.data,
        requestOptions
      )
      return {
        status: 'success',
        data: resultData.data
      }
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.message ?? 'Wyre payout handle error'
      )
    }
  }

  public async put(path: string, body?: any, options?: any): Promise<any> {
    try {
      const requestOptions = this.buildRequestOptions(
        'PUT',
        path,
        body,
        options
      )
      const resultData = await axios.put(
        requestOptions.url,
        requestOptions.data,
        requestOptions
      )
      return {
        status: 'success',
        data: resultData.data
      }
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.message ?? 'Wyre payout handle error'
      )
    }
  }

  public async delete(path: string, body?: any, options?: any): Promise<any> {
    try {
      const requestOptions = this.buildRequestOptions(
        'DELETE',
        path,
        body,
        options
      )
      const resultData = await axios.delete(requestOptions.url, requestOptions)
      return {
        status: 'success',
        data: resultData.data
      }
    } catch (error) {
      throw new BadRequestException(
        error?.response?.data?.message ?? 'Wyre payout handle error'
      )
    }
  }

  private buildRequestOptions(
    method: string,
    path: string,
    params: any,
    options: any
  ) {
    options = options || {}
    const parsedUrl = url.parse(url.resolve(this.baseURL, path), true)
    const timestamp = Date.now()

    // build options request
    const requestOptions: AxiosRequestConfig = {
      ...options,
      url: `${this.baseURL}${path}?timestamp=${timestamp}`, // no querystring here!
      method: method,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.secretKey}`
      },
      params: {}
    }

    if (requestOptions.method == 'GET') {
      requestOptions.params = Object.assign(requestOptions.params, params)
    } else {
      requestOptions.data = params
    }
    Object.assign(requestOptions.params, parsedUrl.query)
    return requestOptions
  }
}
