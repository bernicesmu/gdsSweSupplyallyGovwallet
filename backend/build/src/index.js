"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetDb = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_1 = require("firebase/app");
const database_1 = require("firebase/database");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const firebaseConfig = {
    apiKey: "AIzaSyCbZnjvgYr5SiqpVVRQ3DNNImsC7EyckSE",
    authDomain: "govtechsupplyallygovwallet.firebaseapp.com",
    databaseURL: "https://govtechsupplyallygovwallet-default-rtdb.firebaseio.com",
    projectId: "govtechsupplyallygovwallet",
    storageBucket: "govtechsupplyallygovwallet.appspot.com",
    messagingSenderId: "171287448862",
    appId: "1:171287448862:web:c59bcc084f75acbfb84d0f",
    measurementId: "G-TD7SX4XXEP"
};
const app = (0, express_1.default)();
exports.app = app;
const port = 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, database_1.getDatabase)(firebaseApp);
function resetDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const team_mapping = {};
        yield (0, database_1.set)((0, database_1.ref)(db, "/"), {});
        yield fs_1.default.createReadStream('assets/csv-team-mapping-long.csv')
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => team_mapping[data.staff_pass_id] = data)
            .on('end', () => {
            (0, database_1.set)((0, database_1.ref)(db, "/"), {
                team_mapping
            });
        });
    });
}
exports.resetDb = resetDb;
app.get("/resetDatabase", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        resetDb();
        return response.status(200).json({
            error: false,
            message: "Database reset successful",
            result: true
        });
    }
    catch (error) {
        return response.status(500).json({
            "error": true,
            "message": error.message
        });
    }
}));
app.get("/find/:staffId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const staffId = request.params.staffId;
    const dataRef = (0, database_1.ref)(db, 'team_mapping/' + staffId);
    // var found = false; 
    try {
        yield (0, database_1.onValue)(dataRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                return response.status(200).json({
                    error: false,
                    message: "Staff ID found and returned",
                    result: true,
                    data: data
                });
            }
            else {
                return response.status(200).json({
                    error: false,
                    message: "Staff ID not found",
                    result: false
                });
            }
        });
    }
    catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message
        });
    }
}));
app.post("/redemption/create", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const staffId = request.body.staff_pass_id;
    const redeemed_at = request.body.redeemed_at;
    try {
        const dataRefStaff = (0, database_1.ref)(db, 'team_mapping/' + staffId);
        const snapshotStaff = yield (0, database_1.get)(dataRefStaff); // Use get to await the data
        if (snapshotStaff.exists()) {
            const dataStaff = snapshotStaff.val();
            const team_name = dataStaff.team_name;
            const dataRefRedemption = (0, database_1.ref)(db, 'redemption/' + team_name);
            const snapshotRedemption = yield (0, database_1.get)(dataRefRedemption); // Use get to await the data
            if (snapshotRedemption.exists()) {
                return response.status(200).json({
                    error: false,
                    message: "Already redeemed",
                    result: false,
                    data: snapshotRedemption.val()
                });
            }
            else {
                const redemptionDetails = {
                    team_name: team_name,
                    staff_pass_id: staffId,
                    redeemed_at: redeemed_at
                };
                yield (0, database_1.set)((0, database_1.ref)(db, "redemption/" + team_name), redemptionDetails);
                return response.status(200).json({
                    error: false,
                    message: "Redemption created successfully",
                    result: true,
                    data: redemptionDetails
                });
            }
        }
        else {
            return response.status(200).json({
                error: false,
                message: "Staff ID not found",
                result: false
            });
        }
    }
    catch (error) {
        return response.status(500).json({
            error: true,
            message: error.message
        });
    }
}));
app.listen(port, () => {
    console.log(`Started application on port ${port}`);
});
