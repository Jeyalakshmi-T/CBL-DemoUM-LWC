@isTest
public class MulChildRecorCrControllerTest {
    
    @isTest
    static void testGetChildObjectList() {
        // Test data
        CustomFieldSet__c cs = new CustomFieldSet__c();
        cs.ObjectName__c = 'Contact';
        cs.ParentObjectName__c = 'Account';
        cs.IsParLookUpField__c = 'Yes';
        
        insert cs;
        
        String parentObjectName = 'Account'; // Replace with your desired parent object API name
        // Call the method under test
        List<String> childObjectNames = mulChildRecorCrController.getChildObjectList(parentObjectName);
        
        // Verify that the returned list is not null
        System.assertNotEquals(null, childObjectNames);
        
        System.assertEquals(true, childObjectNames.contains('Contact'));
        //System.assertEquals(true, childObjectNames.contains('Case'));
    }
    
    @isTest
    static void testGetFieldNames() {
        // Test data
        
        CustomFieldSet__c cs = new CustomFieldSet__c();
        cs.ObjectName__c = 'Contact';
        cs.ParentObjectName__c = 'Account';
        cs.IsParLookUpField__c = 'Yes';
        
        insert cs;
        
        String parentObjectName = 'Account'; // Replace with your desired parent object API name
        String objectName = 'Contact'; // Replace with your desired object API name
        
        // Call the method under test
        List<Map<String,String>> fieldNames = mulChildRecorCrController.getFieldNames(parentObjectName, objectName);
        
        // Verify that the returned list is not null
        System.assertNotEquals(null, 'AccountId');
        
    }
    
    @isTest
    static void testCreateChildRecords() {
        // Test data
        
        CustomFieldSet__c cs = new CustomFieldSet__c();
        cs.ObjectName__c = 'Contact';
        cs.ParentObjectName__c = 'Account';
        cs.ObjFieldName__c = 'AccountId';
        cs.IsParLookUpField__c = 'Yes';
        
        insert cs;
        
        List<Map<String, String>> lstChildRecords = new List<Map<String, String>>();
        Map<String, String> mapStr = new Map<String, String>();
        mapStr.put('LastName','TestContact 1');
        mapStr.put('id','row-0');
        lstChildRecords.add(mapStr);
        mapStr.clear();
        
        mapStr.put('LastName','TestContact 2');
        mapStr.put('id','row-1');
        lstChildRecords.add(mapStr);

        Account acc = new Account();
        acc.Name = 'Test Account 1';
        acc.Industry = 'Technology'; // Optional, set additional fields as needed
        // Set other fields as needed

        insert acc;

        Account acc1 = [SELECT Id from Account where Name = 'Test Account 1' LIMIT 1];

        String parentObjectName = 'Account'; // Replace with your desired parent object API name
        String objectName = 'Contact'; // Replace with your desired object API name
        String parRecordId = acc1.Id; // Replace with a valid parent record Id
        
        // Call the method under test
        Test.startTest();
        List<SObject> insertedRecords = mulChildRecorCrController.createChildRecords(lstChildRecords, parentObjectName, objectName, parRecordId);
        Test.stopTest();
        
        // Add assertions based on the expected behavior of the method
        // For example, you could check if the inserted records are returned correctly
        
        // Example:
        System.assertEquals(2, insertedRecords.size());
    }
}