public with sharing class AllObjectListController {
    
    //To fetch All Objects
    @AuraEnabled(cacheable = true)
    public static List<String> getAllObjectNames() {
        List<String> objectNames = new List<String>();
        for(Schema.SObjectType objType : Schema.getGlobalDescribe().values()){   //Schema to get all the Objects

            Schema.DescribeSObjectResult objResult = objType.getDescribe();
            objectNames.add(objResult.getName());
        }
        objectNames.sort();
        return objectNames;
    }

    //To fetch Child Objects for the selected Parent Object
    @AuraEnabled(cacheable=true)
    public static List<String> getChildInfo(String parentObjectApiName) {
        Set<String> childObjectNamesSet = new Set<String>();

        Schema.DescribeSObjectResult parentDescribe = Schema.getGlobalDescribe().get(parentObjectApiName).getDescribe();
        for (Schema.ChildRelationship childRelationship : parentDescribe.getChildRelationships()) {
            childObjectNamesSet.add(childRelationship.getChildSObject().getDescribe().getName());
        }
        List<String> childObjectNames = new List<String>(childObjectNamesSet);
        childObjectNames.sort();

        return childObjectNames;
    } 
}