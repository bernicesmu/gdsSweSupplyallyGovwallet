import express, { Request, Response } from "express";
import cors from "cors";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";
import fs from 'fs'; 
import csv from 'csv-parser';

const app = express();
const port = 8000;

const firebaseConfig = {
    apiKey: "AIzaSyD-A-_nLJTFtyWgCHL6Sx97hmaoAy2f6mM",
    authDomain: "gdsswegovwallet.firebaseapp.com",
    databaseURL: "https://gdsswegovwallet-default-rtdb.firebaseio.com",
    projectId: "gdsswegovwallet",
    storageBucket: "gdsswegovwallet.appspot.com",
    messagingSenderId: "462244065382",
    appId: "1:462244065382:web:09a249df73ac7ce8fc7da7",
    measurementId: "G-1MP2YW3KGV",
};

app.use(cors());
app.use(express.json());
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

app.get("/resetDatabase", (request: Request, response: Response) => {
    set(ref(db, "/"), {});

    const team_mapping: Record<string, any> = {}; 

    fs.createReadStream('assets/csv-team-mapping-long.csv')
        .pipe(csv())
        .on('data', (data) => team_mapping[data.staff_pass_id] = data)
        .on('end', () => {
            set(ref(db, "/"), {
                team_mapping
            });
            response.send("Database reset successful");
        });
});

app.get("/find/:staffId", (request: Request, response: Response) => {
    const staffId = request.params.staffId;
    console.log(staffId)

    const dataRef = ref(db, 'team_mapping/' + staffId);
    onValue(dataRef, (snapshot: any) => {
        const data = snapshot.val();
        console.log(data)
        response.send(data);
      });
});

app.post("/redemption/check", async (request: Request, response: Response) => {
    const team_name = request.body.team_name;

    const dataRef = ref(db, 'redemption/' + team_name);
    let exists = false; 
    onValue(dataRef, (snapshot: any) => {
        const data = snapshot.val();
        console.log(data)
        if (data) { 
            return response.status(400).json(true);
        } else { 
            return response.status(400).json(false);
        }
    });
});

app.post("/redemption/create", async (request: Request, response: Response) => {
    const {
        team_name,
        staff_pass_id,
        redeemed_at
    } = request.body;

    const redemptionDetails = {
        team_name: team_name, 
        staff_pass_id: staff_pass_id, 
        redeemed_at: redeemed_at
    }; 
    set(ref(db, "redemption/" + team_name), redemptionDetails);
    return response.send("Redemption created successfully");
});

app.listen(port, () => {
    console.log(`Started application on port ${port}`);
});