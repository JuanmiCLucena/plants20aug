import { api, LightningElement } from 'lwc';

export default class DisplayImg extends LightningElement {

    @api url;
    @api width;
    @api height;
}