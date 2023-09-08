"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var fs_1 = __importDefault(require("fs"));
var csv_parser_1 = __importDefault(require("csv-parser"));
var app = (0, express_1.default)();
var port = 8000;
var firebaseConfig = {
    apiKey: "AIzaSyD-A-_nLJTFtyWgCHL6Sx97hmaoAy2f6mM",
    authDomain: "gdsswegovwallet.firebaseapp.com",
    databaseURL: "https://gdsswegovwallet-default-rtdb.firebaseio.com",
    projectId: "gdsswegovwallet",
    storageBucket: "gdsswegovwallet.appspot.com",
    messagingSenderId: "462244065382",
    appId: "1:462244065382:web:09a249df73ac7ce8fc7da7",
    measurementId: "G-1MP2YW3KGV",
};
app.use((0, cors_1.default)());
app.use(express_1.default.json());
var firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
var db = (0, database_1.getDatabase)(firebaseApp);
app.get("/resetDatabase", function (request, response) {
    (0, database_1.set)((0, database_1.ref)(db, "/"), {});
    var team_mapping = {};
    fs_1.default.createReadStream('assets/csv-team-mapping-long.csv')
        .pipe((0, csv_parser_1.default)())
        .on('data', function (data) { return team_mapping[data.staff_pass_id] = data; })
        .on('end', function () {
        (0, database_1.set)((0, database_1.ref)(db, "/"), {
            team_mapping: team_mapping
        });
        response.send("Database reset successful");
    });
});
app.get("/find/:staffId", function (request, response) {
    var staffId = request.params.staffId;
    console.log(staffId);
    var dataRef = (0, database_1.ref)(db, 'team_mapping/' + staffId);
    (0, database_1.onValue)(dataRef, function (snapshot) {
        var data = snapshot.val();
        console.log(data);
        response.send(data);
    });
});
app.post("/redemption/create", function (request, response) {
    var _a = request.body, team_name = _a.team_name, staff_pass_id = _a.staff_pass_id, redeemed_at = _a.redeemed_at;
    var dataRef = (0, database_1.ref)(db, 'redemption/' + team_name);
    (0, database_1.onValue)(dataRef, function (snapshot) {
        var data = snapshot.val();
        console.log(data);
        if (data) {
            response.send("Team already redeemed");
        }
        else {
            var redemptionDetails = {
                team_name: team_name,
                staff_pass_id: staff_pass_id,
                redeemed_at: redeemed_at
            };
            (0, database_1.set)((0, database_1.ref)(db, "redemption/" + team_name), redemptionDetails);
            response.send("Redemption created successfully");
        }
    });
});
app.listen(port, function () {
    console.log("Started application on port ".concat(port));
});
