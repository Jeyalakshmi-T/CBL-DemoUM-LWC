public with sharing class mulChildRecorCrController {

    //To get List of Child Objects
    @AuraEnabled(cacheable=true)
    public static List<String> getChildObjectList(String parObjectName){
        try {
            List<CustomFieldSet__c> lstCusFS = [SELECT Id, ObjectName__c
                                                FROM CustomFieldSet__c
                                                WHERE ParentObjectName__c = :parObjectName
                                                AND IsParLookUpField__c  = 'Yes'];
            List<String> lstChildObjNames = new List<String> ();                                        
            for(CustomFieldSet__c cusFs:lstCusFS){
                String s = cusFs.ObjectName__c;
                lstChildObjNames.add(s);
            }
            return lstChildObjNames;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //To get selected Child object's selected Field Names and Type
    @AuraEnabled(cacheable=true)
        public static List<Map<String,String>> getFieldNames(String parObjectName, String objectName){
        try {
            system.debug('Get Custom FieldSet List ' + parObjectName + ', '+objectName ); 

            List<Map<String,String>> lstFS = new List<Map<String,String>>();
            List<CustomFieldSet__c> lstCusFS = [SELECT Id,ParentObjectName__c, ObjectName__c, ObjFieldName__c, IsParLookUpField__c, Field_Type__c
                                                    FROM CustomFieldSet__c
                                                    WHERE ParentObjectName__c = :parObjectName
                                                    AND ObjectName__c = :objectName];
            system.debug('lstCusFS :' + lstCusFS);
            if(lstCusFS.size() > 0){
                for(CustomFieldSet__c cusFs:lstCusFS){
                    Map<String,String> fsMap= new Map<String,String>();
                    if(cusFs.IsParLookUpField__c != 'Yes'){
                        fsMap.put(cusFs.ObjFieldName__c,cusFs.ObjFieldName__c);
                        fsMap.put('FieldType',cusFs.Field_Type__c);
                        system.debug('fsMap :' + fsMap);
                        lstFS.add(fsMap);
                    }
                }
            }                                        
            return lstFS;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //To create Child Object records
    @AuraEnabled
    public static List<SObject> createChildRecords(List<Map<String,String>> lstChildRecords, String parObjectName, String ObjectName, string parRecordId){
        try {
            List<CustomFieldSet__c> lstCusFS = [SELECT Id,ParentObjectName__c, ObjectName__c, ObjFieldName__c, IsParLookUpField__c
                                                FROM CustomFieldSet__c
                                                WHERE ParentObjectName__c = :parObjectName
                                                AND ObjectName__c = :objectName
                                                AND IsParLookUpField__c = 'Yes' LIMIT 1];
            String parField = lstCusFS[0].ObjFieldName__c;

            List<SObject> recsToInsert = new List<SObject>();

            for(Map<String,String> childRecord :lstChildRecords ){
                SObject recToInsert = (SObject)Type.forName(ObjectName).newInstance();
                for (String fieldName : childRecord.keySet()) {
                    if (recToInsert.getSObjectType().getDescribe().fields.getMap().containsKey(fieldName)) {
                        if(fieldName != 'id'){
                            //Type Casting from FieldTypeValue class
                            Object castFieldTypeValue = FieldTypeValue.convertFieldValue(objectName, fieldName,childRecord.get(fieldName));
                            recToInsert.put(fieldName, castFieldTypeValue);
                        }   
                    } else {
                        System.debug('Field ' + fieldName + ' does not exist on object ' + objectName);
                    }
                    recToInsert.put(parField, parRecordId);
                }
                recsToInsert.add(recToInsert);
            }
            if (!recsToInsert.isEmpty()) {
                Database.SaveResult[] saveResults = Database.insert(recsToInsert, false);
            
                for (Database.SaveResult saveResult : saveResults) {
                    if (!saveResult.isSuccess()) {
                        for (Database.Error error : saveResult.getErrors()) {
                            System.debug('Error inserting record: ' + error.getMessage());
                        }
                    }
                } 
            }
            return recsToInsert;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}