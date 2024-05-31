import { cepApiClient } from "./client"

export const getAddressDetails = async (cep) => {
    const { data } = await cepApiClient.get(`/${cep}`)
    console.log(data)
    return data
}