@isTest
public class AllObjectListControllerTest {
    
    @isTest
    static void testGetAllObjectNames() {
        // Call the method under test
        List<String> objectNames = AllObjectListController.getAllObjectNames();
        
        // Verify that the returned list is not null
        System.assertNotEquals(null, objectNames);
        
        System.assertEquals(true, objectNames.contains('Account'));
        System.assertEquals(true, objectNames.contains('Contact'));
    }
    
    @isTest
    static void testGetChildInfo() {
        // Call the method under test with a sample parent object API name
        String parentObjectApiName = 'Account';
        List<String> childObjectNames = AllObjectListController.getChildInfo(parentObjectApiName);
        
        // Verify that the returned list is not null
        System.assertNotEquals(null, childObjectNames);
        
        System.assertEquals(true, childObjectNames.contains('Opportunity'));
        System.assertEquals(true, childObjectNames.contains('Case'));
    }
}