import { createElement } from '@lwc/engine-dom';
import { getNavigateCalledWith } from 'lightning/navigation';
import SpeciesTile from 'c/speciesTile';

describe('c-species-tile', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when calling imperative Apex.c/speciesList
    async function flushPromise() {
        return Promise.resolve();
    }

    it('DOM renderiza correctamente cosas que dependen de la inicialización', () => {
        // GIVEN
        const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: "Indoors,Outdoors"
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        // Query lightning-card element
        const lightningCardElement = element.shadowRoot.querySelector('lightning-card');
        expect(lightningCardElement).not.toBeNull();
        expect(lightningCardElement.title).toBe('Jazmin');
        // Query img element
        const imgEl = element.shadowRoot.querySelector('img');
        expect(imgEl).not.toBeNull();
        expect(imgEl.src).toBe('https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg');
    });

    it('Icono Indoors se muestra si location incluye indoors', () => {
        // GIVEN
         const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: "Indoors"
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        const lightningIconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(lightningIconElement).not.toBeNull();
        expect(lightningIconElement.iconName).toBe('standard:home');
        expect(lightningIconElement.title).toBe('Indoors');
    });

    it('Icono Outdoors se muestra si location incluye outdoors', () => {
        // GIVEN
         const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: "Outdoors"
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        const lightningIconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(lightningIconElement).not.toBeNull();
        expect(lightningIconElement.iconName).toBe('custom:custom3');
        expect(lightningIconElement.title).toBe('Outdoors');
    });

    it('Icono Indoors no se muestra si location no incluye indoors', () => {
        // GIVEN
         const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: ""
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        const lightningIconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(lightningIconElement).toBeNull();
    });

    it('Icono Outdoors no se muestra si location no incluye outdoors', () => {
        // GIVEN
         const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: ""
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        const lightningIconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(lightningIconElement).toBeNull();
    });

    it('Iconos Indoors y Outdoors se muestran si location incluye ambos', () => {
        // GIVEN
        const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: "Indoors,Outdoors"
        };
        // WHEN
        document.body.appendChild(element);
        // THEN
        // QUERY lightning-icon element
        const lightningIconEls = element.shadowRoot.querySelectorAll("lightning-icon");
        expect(lightningIconEls.length).toBe(2);
        expect(lightningIconEls[0].iconName).toBe("custom:custom3");
        expect(lightningIconEls[1].iconName).toBe("standard:home");
    });

    it('Cuando se clicka lightning-button se llama al servicio de navegación', () => {

        // GIVEN - Inicializo el componente
        const element = createElement('c-species-tile', {
            is: SpeciesTile
        });

        element.specie = {
            Id: "123456",
            Name: "Jazmin",
            Description: "Olorosa y bonita planta trepadora",
            Image_URL__c: 
                "https://i.pinimg.com/originals/88/a4/9f/88a49f73cb34bb49ea799087ad2fba15.jpg",
            Location__c: ""
        };

        document.body.appendChild(element);
        // WHEN - clicka el lightning-button
        const lightningButtonEl = element.shadowRoot.querySelector('lightning-button');
        lightningButtonEl.click();

        // THEN - se ha llamado al servicio de navegación con la pag esperada
        const { pageReference } = getNavigateCalledWith();

        // Verify component called with correct event type and params
        /* {
        type: "standard__recordPage",
        attributes: {
            recordId: this.specie.Id,
            objectApiName: "Species__c", // objectApiName is optional
            actionName: "view",
        }*/
        expect(pageReference.type).toBe('standard__recordPage');
        expect(pageReference.attributes.objectApiName).toBe(
            'Species__c'
        );
        expect(pageReference.attributes.actionName).toBe('view');
        expect(pageReference.attributes.recordId).toBe('123456');
    });

});