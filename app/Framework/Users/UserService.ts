import { AbstractAngularService } from "../../Framework/AbstractAngularService";
import { Injectable } from "@angular/core";
import { User } from "./UserEntity";
import { ConsoleLog } from "../../Framework/Logging/ConsoleLogService";

"use strict";

@Injectable()
export class UserService extends AbstractAngularService {

    private _localStorageKey: string = "AllUser";

    private currentUser: User;
    public get CurrentUser() { return this.currentUser; }

    private loadCurrentUserPromise: Promise<boolean>;

    constructor(private clog: ConsoleLog) {

        super();

        this.loadCurrentUserPromise = this.loadCurrentUser();
    }

    public ping() {
        this.clog.debug(`UserService: got a ping, pinging your right back.`);
    }

    public ensureCurrentUser() {
        return this.loadCurrentUserPromise;
    }

    public loadCurrentUser(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.currentUser = new User();
            this.currentUser.Name = "Paul Galvin";
            this.currentUser.UserID = "Paul";

            this.clog.debug(`UserService: Resolving after assigning hard coded user:`, this.CurrentUser);
            resolve(true);
        });
        
    }

}
