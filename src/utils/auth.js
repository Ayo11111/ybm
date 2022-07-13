/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-02 18:14:59
 */
import store from '@/store'
import { ImmortalStorage, LocalStorageStore } from 'immortal-db'
import {
  SAVE_TOKEN_KEY,
  USER_INFO,
  SAVE_ACCOUNT_KEY,
  IS_REMEMBER_KEY,
  STORE_ID,
  Merchant_Manager_Type,
  BINARY_DRAFT,
  ORDER_MODE
} from '@/store/global-keys'

// TODO 修改为类
const stores = [LocalStorageStore]
const ImmortalDB = new ImmortalStorage(stores)

export async function getToken() {
  return JSON.parse(await ImmortalDB.get(SAVE_TOKEN_KEY))
}

export async function setToken(token) {
  token = JSON.stringify(token)
  return await ImmortalDB.set(SAVE_TOKEN_KEY, token)
}

export async function removeToken() {
  return await ImmortalDB.remove(SAVE_TOKEN_KEY)
}

export async function setUserInfo(userInfo) {
  userInfo = JSON.stringify(userInfo)
  return await ImmortalDB.set(USER_INFO, userInfo)
}

export async function getUserInfo() {
  return JSON.parse(await ImmortalDB.get(USER_INFO))
}

export async function removeUserInfo() {
  return await ImmortalDB.remove(USER_INFO)
}

export async function getAccount() {
  return JSON.parse(await ImmortalDB.get(SAVE_ACCOUNT_KEY))
}

export async function setAccount(account) {
  account = JSON.stringify(account)
  return await ImmortalDB.set(SAVE_ACCOUNT_KEY, account)
}

export async function removeAccount() {
  return await ImmortalDB.remove(SAVE_ACCOUNT_KEY)
}

export async function getRemember() {
  return JSON.parse(await ImmortalDB.get(IS_REMEMBER_KEY))
}

export async function setRemember(flag) {
  flag = JSON.stringify(flag)
  return await ImmortalDB.set(IS_REMEMBER_KEY, flag)
}

export async function removeRemember() {
  return await ImmortalDB.remove(IS_REMEMBER_KEY)
}

export async function setStoreId(id) {
  id = JSON.stringify(id)
  return await ImmortalDB.set(STORE_ID, id)
}

export async function getStoreId() {
  return JSON.parse(await ImmortalDB.get(STORE_ID))
}

export async function setMerchantManagerType(type) {
  type = JSON.stringify(type)
  return await ImmortalDB.set(Merchant_Manager_Type, type)
}

export async function getMerchantManagerType() {
  return JSON.parse(await ImmortalDB.get(Merchant_Manager_Type))
}

export async function setOrderMode(mode) {
  mode = JSON.stringify(mode)
  return await ImmortalDB.set(ORDER_MODE, mode)
}

export async function getOrderMode() {
  return JSON.parse(await ImmortalDB.get(ORDER_MODE))
}

// 进件草稿
// 获取商户id
const getMerchantId = () => store.getters.merchantInfo.merchantId
const generateDraftKey = () => `${BINARY_DRAFT}-${getMerchantId()}`

export async function getBinaryDraft() {
  return JSON.parse(await ImmortalDB.get(generateDraftKey()))
}

export async function setBinaryDraft(value) {
  value = JSON.stringify(value)
  return await ImmortalDB.set(generateDraftKey(), value)
}

export async function removeBinaryDraft() {
  return await ImmortalDB.remove(generateDraftKey())
}
