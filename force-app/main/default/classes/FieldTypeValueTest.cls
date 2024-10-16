@isTest
public class FieldTypeValueTest {
    
    @isTest
    static void testGetObjectType() {
        // Test data
        String objectName = 'Account'; // Replace with your desired object API name
        
        // Call the method under test
        Schema.SObjectType objectType = FieldTypeValue.getObjectType(objectName);
        
        // Verify that the returned object type is not null
        System.assertNotEquals(null, objectType);
        
        System.assertEquals('Account', objectType.getDescribe().getName());
        // ...
    }
    
    @isTest
    static void testGetFieldDescribe() {
        // Test data
        String objectName = 'Account'; // Replace with your desired object API name
        String fieldName = 'Name'; // Replace with your desired field API name
        
        // Call the method under test
        Schema.DescribeFieldResult fieldDescribe = FieldTypeValue.getFieldDescribe(objectName, fieldName);
        
        // Verify that the returned field describe is not null
        System.assertNotEquals(null, fieldDescribe);

        // Example:
        System.assertEquals('Name', fieldDescribe.getName());
        
    }
    
    @isTest
    static void testGetFieldType() {
        // Test data
        String objectName = 'Account'; // Replace with your desired object API name
        String fieldName = 'Name'; // Replace with your desired field API name
        
        // Call the method under test
        String fieldType = FieldTypeValue.getFieldType(objectName, fieldName);
        
        // Verify that the returned field type is not null
        System.assertNotEquals(null, fieldType);
        
        // Example:
        System.assertEquals('STRING', fieldType);
    }
    
    @isTest
static void testConvertFieldValue() {
    // Test data
    String objectName = 'Account'; // Replace with your desired object API name
    String fieldName = 'Name'; // Replace with your desired field API name
    String fieldValue = 'Test Account Name'; // Replace with your desired field value
    
    // Call the method under test
    Object convertedValue = FieldTypeValue.convertFieldValue(objectName, fieldName, fieldValue);
    
    // Verify that the converted value is not null
    System.assertNotEquals(null, convertedValue);
    
    // Example:
    System.assertEquals('Test Account Name', convertedValue);
    
}


}