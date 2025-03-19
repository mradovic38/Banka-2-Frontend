import api from "./axios"
import {AccountResponse, AccountUpdateClientRequest, CreateBankAccountRequest} from "@/types/bankAccount"
import {API_BASE} from "@/constants/endpoints.ts";
import {Transaction, TransactionResponse} from "@/types/transaction.ts";


export const getAccountById = async (id:string) => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${id}`, {
            params:{
                id: id
            } //  TODO: izbaciti kada backend popravi
        });
        return response;
    } catch (error) {
        console.error("Failed to get bank account! :", error);
        throw error;
    }
}

export const getAllAccounts = async (
    pageNumber: number,
    pageSize: number,
    filters: { accountNumber?: string; firstName?: string; lastName?: string;}
): Promise<AccountResponse> => {
    try {
        console.log("Page number", pageNumber);
        console.log("Page size", pageSize);
        const response = await api.get("/accounts", {
            params: {
                number: filters.accountNumber || undefined,
                clientFirstName: filters.firstName || undefined,
                clientLastName: filters.lastName || undefined,
                Page: pageNumber,
                Size: pageSize,
            },
        });
        return response.data;
    }
    catch(error) {
        console.error("❌ Error fetching bank accounts:", error);
        throw error;
    }
}

export const editAccountClient = async (id: string, data: AccountUpdateClientRequest) => {
    try {
        // Make sure to omit the 'name' property if it's undefined or null
        const requestData: AccountUpdateClientRequest = {
            dailyLimit: data.dailyLimit,
            monthlyLimit: data.monthlyLimit,
            name: data.name
        };

        const response = await api.put(`${API_BASE}/accounts/client/${id}`, requestData);
        return response;
    } catch (error) {
        console.error("Failed to edit bank account! :", error);
        throw error;
    }
};


export const createBankAccount = async (data : CreateBankAccountRequest, currency : string) => {

    try {
        const currencyResponse = await api.get("/currencies", {
            params: {
                code: currency
            }   
        });

        data.currencyId = currencyResponse.data.items[0]?.id;
        
        const response = await api.post("/accounts", data);
        return response;
    } catch (error) {
        console.error("❌ Failed to create bank account:", error);
        throw error;
    }

}


export const getAllCreditCardsForBankAccount = async (accountId: string) => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${accountId}/cards`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get credit cards for bank account:", error);
    }
}

export const activateOrDeactivateBankAccount = async (accountId: string, status: boolean) => {
    try {
        const response = await api.put(`${API_BASE}/accounts/employee/${accountId}`, {
            status: status
        });
        return response;
    } catch (error) {
        console.error("❌ Failed to activate/deactivate bank account:", error);
        throw error;
    }
}

export const getAllAccountsClient = async (clientId: string) => {
    try {
        const response = await api.get(`${API_BASE}/clients/${clientId}/accounts`);
        return response;
    } catch (error) {
        console.error("❌ Failed to get bank accounts for client:", error);
        throw error;
    }
}


export const getAllTransactions = async (
    pageNumber: number,
    pageSize: number,
    transactionType: number,
): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/transactions`, {
                params: {
                    Page: pageNumber,
                    Size: pageSize,
                    Type: transactionType
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get all transactions:", error);
        throw error;
    }
}

export const getAccountTransactions = async (
    pageNumber: number,
    pageSize: number,
    transactionType: number,
    // account moze biti undefined
    account: string | undefined
): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/accounts/${account}/transactions`, {
                params: {
                    Page: pageNumber,
                    Size: pageSize,
                    Type: transactionType
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get all transactions for your bank account:", error);
        throw error;
    }
}

export const getNewTransactions = async (): Promise<TransactionResponse> => {
    try {
        const response = await api.get(`${API_BASE}/transactions/new`);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get recent transactions:", error);
        throw error;
    }
}