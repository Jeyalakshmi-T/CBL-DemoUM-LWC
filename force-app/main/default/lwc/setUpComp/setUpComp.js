import { LightningElement, track, wire } from 'lwc';    
import getAllObjectNames from '@salesforce/apex/AllObjectListController.getAllObjectNames';
import getChildInfo from '@salesforce/apex/AllObjectListController.getChildInfo';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class setUpComp extends LightningElement {

    @track selectedParentObject ='';
    @track parentNameoptions =[];
    @track dualoptions = [];
    @track selectedDualOptions = '';
    @track selectedChildObject = '';
    @track showModal = false;

    @wire(getAllObjectNames)   
    wiredObjectInfo({data, error}){
        if(data){
            this.parentNameoptions = data.map(objName=>({label:objName, 
                                                         value:objName}));
        }else if(error){
            console.log('Error fetching Object Information', error);
        }
    }

    handleComboChange(event){
        this.selectedParentObject = event.detail.value;     
        this.loadChildObjects();    
    }

    loadChildObjects(){
        if(this.selectedParentObject){
            getChildInfo({parentObjectApiName: this.selectedParentObject})
            .then(result =>{
                this.dualoptions = result.map(childName=>({label: childName, 
                                                           value:childName}));
            })
            .catch(error => {
                console.error('Error fetching child objects', error);
            });
        }
    } 

    handleDualChange(event){
        this.selectedChildObject = event.detail.value;
        this.selectedChildObjects = event.detail.value;
    }

    CreateFieldSets(){
        createFieldSets({ parObjectName: this.selectedParentObject, childObjects: this.selectedChildObjects})
        .then(result => {
            let messageResult = result;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: JSON.stringify(messageResult),
                    variant: 'success',
                }),
            );
            this.dispatchEvent(new CustomEvent('modalsuccess'));
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: JSON.stringify(error),
                    variant: 'error',
                }),
            );
        });
    }

    handleCancel(){
        this.selectedParentObject = '';
        this.selectedDualOptions = '';
        this.selectedChildObject = '';
        this.selectedChildObjects = '';
        this.dualoptions = '';
    }

    handleNext(){
        this.showModal = true;
    }

    handleModalCancel(){
        this.showModal = false;
    }

    handleModalSucess(){
        this.showModal=false;
        this.selectedDualOptions = '';
        this.selectedChildObject = '';
        this.selectedChildObjects = '';
    }
}