import { LightningElement, wire } from 'lwc';
import getAllSpecies from '@salesforce/apex/SpeciesService.getAllSpecies';

export default class SpeciesList extends LightningElement {
    
    @wire(getAllSpecies)
    species;
}