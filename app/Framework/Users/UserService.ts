import { AbstractAngularService } from "../../Framework/AbstractAngularService";
import { Injectable } from "@angular/core";
import { User } from "./UserEntity";

"use strict";

@Injectable()
export class UserService extends AbstractAngularService {

    private _localStorageKey: string = "AllUser";

    private _currentUser: User;
    public get CurrentUser() { return this._currentUser; }

    private _loadCurrentUserPromise: Promise<boolean>;

    constructor() {

        super();

        this._loadCurrentUserPromise = this._loadCurrentUser();
    }

    public ping() {
        console.debug(`UserService: got a ping, pinging your right back.`);
    }

    public EnsureCurrentUser() {
        return this._loadCurrentUserPromise;
    }

    public _loadCurrentUser(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this._currentUser = new User();
            this._currentUser.Name = "Paul Galvin";
            this._currentUser.UserID = "Paul";

            console.log(`UserService: Resolving after assigning hard coded user:`, this.CurrentUser);
            resolve(true);
        });
        
    }

}
