// src/appwrite/authconfig.js
import { Account, Client, ID } from "appwrite";
import conf from '../conf/conf.js';

console.log(conf.myanFloodPlanDatabaseId);
export class AuthService {
    client = new Client();
    account;
    
    constructor() {
        this.client
            .setEndpoint(conf.myanFloodPlanURL)
            .setProject(conf.myanFloodPlanProjectId);
        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }
    async googleOAuthSignup ()  {
    return await account.createOAuth2Session('google', 'https://your-success-url.com')
        }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error;
        }
        return null;
    }

    async logout() {
        try {
            await this.account.deleteSession("current");
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
