trigger PlantTrigger on Plant__c (before insert, before update) {

    // Trigger.isBefore, Trigger.isInsert ...
    
    // Cuando se crea o actualiza una planta (cambiando su fecha de regado) --> calcular sig fecha riego

    // ... List<Species__c> species = [SELECT Summer_Watering_Frequency__c FROM Species__c WHERE Id IN :specieIds];
    
    if(Trigger.isInsert || Trigger.isUpdate) {
        // Precargar información necesaria de objetos relacionados
        Set<Id> specieIds = new Set<Id>();
        for(Plant__c newPlant : Trigger.new) {
            Plant__c oldPlant = (Trigger.isUpdate) ? Trigger.oldMap.get(newPlant.Id) : null; // Si estamos insertando oldMap es null por eso comprobamos
            if(oldPlant == null || oldPlant.Last_Watered__c != newPlant.Last_Watered__c) {
                specieIds.add(newPlant.Species__c);
            }
        }

        List<Species__c> species = [SELECT Summer_Watering_Frequency__c, Winter_Watering_Frequency__c FROM Species__c WHERE Id IN :specieIds];
        Map<Id, Species__c> speciesById = new Map<Id, Species__c>(species);

        // Si está cambiando la fecha de riego
        // Obtener valor nuevo fecha riego de Trigger.new
        // Obtener valor antiguo fecha riego de Trigger.old
        // Trigger.old / Trigger.new / Trigger.oldMap / Trigger.newMap

        for(Plant__c newPlant : Trigger.new) {
            // Obtenemos la versión antigua del registro 'newPlant'
            Plant__c oldPlant = (Trigger.isUpdate) ? Trigger.oldMap.get(newPlant.Id) : null;
            if(oldPlant == null ||  oldPlant.Last_Watered__c != newPlant.Last_Watered__c) {
                // Calcular siguiente fecha de riego
                // Ver de qué especie es mi planta
                ID specieId = newPlant.Species__c;
                // Traer objeto especie
                Species__c specie = speciesById.get(specieId); // BIEN!!!
                // Pedir frecuencia de riego para esa especie
                Integer daysToAdd = FrequencyService.getWateringDays(specie);
                // sig fecha riego = ultima fecha riego + dias devueltos
                newPlant.Next_Water__c = newPlant.Last_Watered__c.addDays(daysToAdd);
            }
        }


        
    }

    // Cuando se crea o actualiza una planta (cambiando su fecha de abonado) --> calcular sig fecha abonado

}