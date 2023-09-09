import axios from 'axios';

var baseUrl = 'http://localhost:8000'

export async function resetDatabase() { 
    let api_url = baseUrl + "/resetDatabase";
    try { 
        const response = await axios.get(api_url); 
        return response.data;
    } catch(error) {
        return error; 
    }
}

export async function getStaffDetails(staffId : string) { 
    let api_url = baseUrl + "/find/" + staffId;
    try { 
        const response = await axios.get(api_url); 
        return response.data;
    } catch(error) {
        return error; 
    }
}

export async function createRedemption(redemptionDetails : object) { 
    let api_url = baseUrl + "/redemption/create";
    try { 
        const response = await axios.post(api_url, redemptionDetails); 
        return response.data;
    } catch(error) {
        return error; 
    }
}