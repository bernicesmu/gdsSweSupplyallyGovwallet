import express, { Request, Response } from "express";
import cors from "cors";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import fs from 'fs'; 
import csv from 'csv-parser';
import firebaseConfig from "./config";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

async function resetDb() { 
    const team_mapping: Record<string, any> = {};
    await set(ref(db, "/"), {});
    await fs.createReadStream('assets/csv-team-mapping-long.csv')
        .pipe(csv())
        .on('data', (data) => team_mapping[data.staff_pass_id] = data)
        .on('end', () => {
            set(ref(db, "/"), {
                team_mapping
            });
        });
}

app.get("/resetDatabase", async (request: Request, response: Response) => {
    try { 
        resetDb()
        return response.status(200).json({ 
            error: false,
            message: "Database reset successful",
            result: true
        });
    } catch(error : any) { 
        return response.status(500).json({
            "error": true,
            "message": error.message
        });
    }
});

app.get("/find/:staffId", async (request: Request, response: Response) => {
    const staffId = request.params.staffId;

    const dataRef = ref(db, 'team_mapping/' + staffId);
    // var found = false; 
    try { 
        await onValue(dataRef, (snapshot: any) => {
            const data = snapshot.val();
            if (data) { 
                return response.status(200).json({
                    error: false, 
                    message: "Staff ID found and returned", 
                    result: true, 
                    data: data
                });
            } else { 
                return response.status(200).json({
                    error: false,
                    message: "Staff ID not found",
                    result: false 
                });
            }
        });
    } catch(error : any) { 
        return response.status(500).json({
            error: true,
            message: error.message
        });
    }
});

app.post("/redemption/create", async (request: Request, response: Response) => {
    const staffId = request.body.staff_pass_id;
    const redeemed_at = request.body.redeemed_at;

    try {
        const dataRefStaff = ref(db, 'team_mapping/' + staffId);
        const snapshotStaff = await get(dataRefStaff); // Use get to await the data

        if (snapshotStaff.exists()) {
            const dataStaff = snapshotStaff.val();
            const team_name = dataStaff.team_name;

            const dataRefRedemption = ref(db, 'redemption/' + team_name);
            const snapshotRedemption = await get(dataRefRedemption); // Use get to await the data

            if (snapshotRedemption.exists()) {
                return response.status(200).json({
                    error: false, 
                    message: "Already redeemed",
                    result: false,
                    data: snapshotRedemption.val()
                });
            } else { 
                const redemptionDetails = {
                    team_name: team_name, 
                    staff_pass_id: staffId, 
                    redeemed_at: redeemed_at
                }; 
                await set(ref(db, "redemption/" + team_name), redemptionDetails);

                return response.status(200).json({
                    error: false, 
                    message: "Redemption created successfully",
                    result: true, 
                    data: redemptionDetails
                });
            }
        } else { 
            return response.status(200).json({
                error: false,
                message: "Staff ID not found",
                result: false 
            });
        }
    } catch(error : any) { 
        return response.status(500).json({
            error: true, 
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Started application on port ${port}`);
});

export {app, resetDb};