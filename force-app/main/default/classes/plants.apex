// Use .apex files to store anonymous Apex.
// You can execute Anonymous Apex in VS Code by selecting the
//  ... apex test and running the command:
//  ... SFDX: Execute Anonymous Apex with Currently Selected Text
//  You can also execute the entire file by running the command:
//  ... SFDX: Execute Anonymous Apex with Editor Contents

Integer allJasmines = [SELECT COUNT() FROM Plant__c WHERE Species__r.Name = 'Jazmin'];
System.debug(allJasmines);

// Forma sencilla --> AVG, MIN, MAX, SUM - FUNCIONES AGREGADAS

List<AggregateResult> aggrResult = [SELECT AVG(Max_Temperature__c) avgTemp FROM Species__c];

for(AggregateResult ar : aggrResult) {
    System.debug('Average Temperature: ' + ar.get('avgTemp'));
}

// Forma agrupada --> Type__c = 'Edible' or 'Ornamental'
List<AggregateResult> aggrResult = [SELECT AVG(Max_Temperature__c) avgTemp, Type__c FROM Species__c GROUP BY Type__c];

for(AggregateResult ar : aggrResult) {
    System.debug('Type__c: ' + ar.get('Type__c'));
    System.debug('Average Temperature: ' + ar.get('avgTemp'));
}

// insert, update, delete, undelete, merge

// Insertar
Species__c newSpecies = new Species__c();
newSpecies.Name = 'Ivy';
insert newSpecies;

Species__c newSpecies2 = new Species__c(Name = 'Ivy 2');
insert newSpecies2;

try {
    List<Species__c> ivy = [SELECT Name FROM Species__c WHERE Name = 'Ivy 2'];
    ivy[0].Name = 'Ivy 2 cambiado';
    update ivy; // Validación falla! --> Auto rollback
} catch (Exception e) {
    // Gestionar la exc ... mandar email, tomar nota de la exc...
    throw e;
}

Species__c ivy = [SELECT Name FROM Species__c WHERE Name = 'Ivy 2 cambiado' LIMIT 1];
delete ivy;

// Savepoint
SavePoint sp = Database.setSavepoint();
try {
    Species__c mySpecies = new Species__c(Name = 'Aloe Vera');
    insert mySpecies;

    Plant__c myPlant = new Plant__c();
    myPlant.Description__c = 'New aloe vera, my favourite one!';
    myPlant.Species__c = mySpecies.Id; // Id gets automatically populated on insert
    insert myPlant;
} catch (DmlException e) {
    // Process exception here, for instance log it and show a friendly message to the user ...
    Database.rollback(sp);
}