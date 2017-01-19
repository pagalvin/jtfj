declare var _: any;
declare var moment: any;

import {Component} from '@angular/core';
//import * as moment from 'moment';


import { Functionals } from '../../Framework/Functionals'
import { Strings } from '../../Framework/AppStrings';

@Component({
    selector: 'jtfj-global-footer',
    templateUrl: `app/Menus/GlobalFooter/GlobalFooter.View.html`,
})
export class GlobalFooterComponent {

    public CopyrightHistory: string;

    constructor() {

        this.CopyrightHistory = this.getCopyrightHistory();

    } // constructor

    private getCopyrightHistory(): string {

        const thisYear = moment().year();
        const bornIn = 2016;

        const yearsAlive = _.range(thisYear - bornIn).reduce((prevYears: string[], currYear: any, index: number) => {
            return prevYears.concat((thisYear - index - 1).toString());
        }, [thisYear.toString()]);

        //this.$log.debug(`GlobalFooterComponent: _getCopyrightHistory: years alive:`, yearsAlive);

        const result = Functionals.stringArrayToCdl(yearsAlive);

        return result;

    }

    public showCopyrightInfo() {

        console.info(`GlobalFooter.Component: ShowCopyrightInfo: Entering, copyirght notice:`, Strings.CopyrightNotice);

            //this._modalsFactory.CreateOKModal("Copyright Notice", jtfj.Framework.Strings.CopyrightNotice);
    }

    public showTermsOfService() {

        //this._modalsFactory.CreateOKModal("Terms of Service", jtfj.Framework.Strings.TermsOfService);
    }

    public showPrivacyPolicy() {

        //this._modalsFactory.CreateOKModal("Privacy Policy", jtfj.Framework.Strings.PrivacyPolicy);

    }

}

