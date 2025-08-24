import { LightningElement, wire } from 'lwc';
import getFilteredSpecies from '@salesforce/apex/SpeciesService.getFilteredSpecies';

export default class SpeciesList extends LightningElement {

    // Properties, GETTERS & SETTERS
    searchText = "";
    
    // LIFECYCLE HOOK

    // WIRE
    @wire(getFilteredSpecies, { searchText : '$searchText' })
    species;

    // METHODS
    handleInputChange(event) {
        const searchTextAux = event.target.value;
        if(searchTextAux.length >= 3 || searchTextAux === '') {
            this.searchText = searchTextAux;
        }
    }
}