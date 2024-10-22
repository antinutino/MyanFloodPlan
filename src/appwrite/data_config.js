import { Client, Databases, ID, Query, Teams } from 'appwrite';
import conf from '../conf/conf.js';

export class Service {
    client = new Client();
    databases;
    bucket;
    
    constructor() {
        this.client
            .setEndpoint(conf.myanFloodPlanURL)
            .setProject(conf.myanFloodPlanProjectId);
        this.databases = new Databases(this.client);
        // this.bucket = new Storage(this.client);

    }

    async myanHelpPosts({ User_Name, Location, Post_Description,Time }) {
        console.log(User_Name)
        try {
            console.log(conf.myanHelpPostsCollectionId)
            return await this.databases.createDocument(
               
                conf.myanFloodPlanDatabaseId,
                conf.myanHelpPostsCollectionId,

                ID.unique(), {
                    User_Name,
                    Location,
                    Post_Description,
                    Time
                }
            );
        } catch (error) {
            throw error;
        }
    }
    async createTeam({ Team_Name, Rescue_Location, Plan_Description,Time,Team_Leader }) {

        try {
            console.log(conf.myanRescueTeamCollectionId)
            return await this.databases.createDocument(
               
                conf.myanFloodPlanDatabaseId,
                conf.myanRescueTeamCollectionId,
                ID.unique(), {
                    Team_Name,
                    Rescue_Location,
                    Plan_Description,
                    Time,
                    Team_Leader
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async createUserProfile({ Name, Email, TeamsID}) {

        try {
            return await this.databases.createDocument(
               
                conf.myanFloodPlanDatabaseId,
                conf.myanFloodPlanCollectionId,
                ID.unique(), {
                    Name,
                    Email,
                    TeamsID
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async sendMessageToInbox({ RescueTeamID,SenderName,Message}) {

        try {
            return await this.databases.createDocument(
               
                conf.myanFloodPlanDatabaseId,
                conf.myanTeamDataCollectionId,
                ID.unique(), {
                    RescueTeamID,
                    SenderName,
                    Message
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async createteamdata({ RescueTeamID,HelpPostsID}) {

        try {
            return await this.databases.createDocument(
               
                conf.myanFloodPlanDatabaseId,
                conf.myanTeamDataCollectionId,
                ID.unique(), {
                    RescueTeamID,
                    HelpPostsID
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async getHelpPosts() {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanHelpPostsCollectionId,
          );

          
          // Handle the response
          console.log('Fetched Document:', response);
          return response.documents;
          
          if (response.total > 0) {
            return response.documents[0]; // Return the first matching document
          } else {
            throw new Error('No document found');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getMyTeams(Email) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanFloodPlanCollectionId,
            [Query.equal('Email', Email)]
          );
          // Handle the response
          console.log('Fetched Document:', response);
          return response.documents;
          
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getMyTeamdata(RescueTeamID) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanTeamDataCollectionId,
            [Query.equal('RescueTeamID', RescueTeamID)]
          );
          // Handle the response
          console.log('Fetched Document:', response);
          return response.documents;
          
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getMyTeamsbyID(documentid) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.getDocument(
            conf.myanFloodPlanDatabaseId,
            conf.myanRescueTeamCollectionId,
            documentid
          );
          // Handle the response
          console.log('Fetched Document:',response);
          return response;
          
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getTagedPostsbyID(documentid) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.getDocument(
            conf.myanFloodPlanDatabaseId,
            conf.myanHelpPostsCollectionId,
            documentid
          );
          // Handle the response
          console.log('Fetched Document:',response);
          return response;
          
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getHelpPostsinLocation(location) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanHelpPostsCollectionId,
            [Query.equal('Location', location)]
          );
          
          // Handle the response
          console.log('Fetched Document:', response);
          
          if (response.total > 0) {
            return response.documents[0]; // Return the first matching document
          } else {
            throw new Error('No document found');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }



    async getsearchteams(Rescue_Location) {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanRescueTeamCollectionId,
            [Query.equal('Rescue_Location', Rescue_Location)]
          );
          // Handle the response
          console.log('Fetched Document:', response);
          
         return response.documents; // Return the first matching document
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }
     

        
    async getSearchData(districtvalue,subdistrictvalue) {
        try {
            console.log(districtvalue);
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.subletshebaDatabaseId,
            conf.subletshebaCollectionId,
            [
                Query.equal('district', districtvalue),
                Query.equal('subdistrict', subdistrictvalue)
            ]
          );
          // Handle the response
          console.log('Fetched Document:', response);
          
         return response.documents; // Return the first matching document
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async getrescueteams() {
        try {
          // Make a request to fetch the document by email
          const response = await this.databases.listDocuments(
            conf.myanFloodPlanDatabaseId,
            conf.myanRescueTeamCollectionId,
          );
          // Handle the response
          console.log('Fetched Document:', response);
          
         return response.documents; // Return the first matching document
        } catch (error) {
          console.error('Error fetching document:', error);
          throw error; // Handle or rethrow the error as needed
        }
    }

    async createPost({ title, details }) {
        try {
            return await this.databases.createDocument(
                conf.subletshebaDatabaseId,
                conf.subletshebaCollectionId,
                ID.unique(), {
                    title,
                    details
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async updatePost({ title, details }) {
        try {
            return await this.databases.updateDocument(
                conf.subletshebaDatabaseId,
                conf.subletshebaCollectionId,
                ID.unique(), {
                    title,
                    details
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async deletePost(documentid) {
        try {
            console.log(documentid);
            await this.databases.deleteDocument(
                conf.subletshebaDatabaseId,
                conf.subletshebaCollectionId,
                documentid
            );
            return true;
        } catch (error) {
            throw error;
            return false;
        }
    }
}

const service = new Service();
export default service;
