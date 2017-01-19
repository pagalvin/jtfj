import { Injectable } from '@angular/core';
import { AbstractAngularService } from "../Framework/AbstractAngularService";
import { UserService } from "../Framework/Users/UserService";

"use strict";

@Injectable()
export class RecordIDsService extends AbstractAngularService {

    private _localStorageKeySeed: string = "JTFJ.IDs.";

    //private _loadAllRecordIDsPromise: Promise<boolean>;

    constructor(
        private _userService: UserService) {

        super();

    }

    public ping() {
        console.debug(`RecordIDsService: got a ping, pinging your right back.`);
    }

    public GetUniqueID(): Promise<string> {

        console.debug(`RecordsIDService: GetUniqueID: Entering.`);

        return new Promise<string>((resolve, reject) => {
            
            this._userService.EnsureCurrentUser().then(
                () => {

                    console.debug(`RecordsIDService: GetUniqueID: Got the current user, determining next ID.`);

                    const thisStorageKey = this._localStorageKeySeed + this._userService.CurrentUser.UserID;

                    const nextNumericPortion: number = parseInt(localStorage.getItem(thisStorageKey));
                    const saveKey: number = nextNumericPortion ? nextNumericPortion + 1 : 1;
                    const returnKey = this._userService.CurrentUser.UserID + "_" + saveKey.toString();

                    localStorage.setItem(thisStorageKey, saveKey.toString());

                    resolve(returnKey);

                });

        });
    }
}

