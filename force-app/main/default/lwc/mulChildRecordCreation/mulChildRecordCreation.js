import { LightningElement, api, wire } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';

import getFieldNames from '@salesforce/apex/mulChildRecorCrController.getFieldNames';   
import createChildRecords from '@salesforce/apex/mulChildRecorCrController.createChildRecords';
import getChildObjectList from '@salesforce/apex/mulChildRecorCrController.getChildObjectList';

import mulChildRecordCreation from './mulChildRecordCreation.html';
import mulChildRecordCreationA from './mulChildRecordCreationA.html';

const templateNameA = 'templateA';

export default class MulChildRecordCreation extends LightningElement {

    @api objectApiName;
    @api recordId;
    
    relObj=[];
    relObjName=[];
    templateName;
    templateNameA = templateNameA;
    selObjectName;
    lstFields=[];
    columns=[];
    childRecords=[];
    emptyRecords=[];
    recordCount=2; // Default 2 records
    addOneRec=1;
    childRecFieldNames=[];
    saveDraftValues=[];
    savedChildRecords=[];
    showRecordCreated=false;
    disCreate=true;

    render(){
        switch(this.templateName){
            case templateNameA :
                return mulChildRecordCreationA;
            default:
                return mulChildRecordCreation;    
        }
    }

    @wire(getChildObjectList, {parObjectName:'$objectApiName'})
    ObjectInfo({error,data}){
        if(data){
            this.relObj = data;
            this.getChildObjectNames();
            console.log('In relObj :' + JSON.stringify(this.relObj));
        } else if(error){
            console.log('In error :' + JSON.stringify(error));
        }
    }

    getChildObjectNames(){
        this.relObjName = [];
        console.log('In getChildObjectNames ' + this.relObjName);

        for (let index = 0; index < this.relObj.length; index++) {
            this.relObjName.push({label : this.relObj[index], 
                        value : this.relObj[index]});
        }
        console.log('relObjName 11:' + JSON.stringify(this.relObjName));
    }

    handleChange(event){
        console.log('In Handle Change :');
        this.selObjectName = event.target.value;
        console.log('Selected Value :' + this.selObjectName);
    }

    handleNext(){
        if(this.selObjectName == null){
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a related object before proceeding.',
                    variant: 'error',
                }),
            );
        }else{
            console.log('In Handle Next');
            this.templateName = this.templateNameA;
            console.log('templateName :' + this.templateName);
            this.getDisplayFields();
        }   
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
        console.log('In Handle Cancel :' + this.templateName);
        this.templateName ='';
    }

    handleDone(){
        console.log('In Handle Done :');
        //this.isShow = true;
        this.savedChildRecords = [];
        this.showRecordCreated = false;
        this.dispatchEvent(new CloseActionScreenEvent());
        this.templateName =''; 
    }

    handleAddRow(){
        console.log('In Handle Add Row');
        this.createEmptyRecords(this.addOneRec);
        console.log(' Add Row Empty Record :' + JSON.stringify(this.emptyRecords));
        console.log('BF CR :' + JSON.stringify(this.childRecords));
        this.childRecords.push(this.emptyRecords);
        console.log('AF CR :' + JSON.stringify(this.childRecords));
        this.childRecords = [...this.childRecords];
   
    }

    getDisplayFields(){
        console.log('objectApiName :' + this.objectApiName);
        console.log('In getDisplayFields :' + this.selObjectName);
        getFieldNames({parObjectName:this.objectApiName,objectName : this.selObjectName})
        .then((data)=>{
            this.lstFields = data;
            console.log('lstFields :' + JSON.stringify(this.lstFields));
           
            for (let index = 0; index < this.lstFields.length; index++) { 
                this.childRecFieldNames.push(Object.values(this.lstFields[index])[0]);
            }
            
            this.columns = this.lstFields.map(field => {
                const fldName = Object.values(field)[0];  
                const label = Object.keys(field)[0];  
                return {
                  label: label,
                  fieldName: fldName,
                  editable: true
                };
            });

            console.log('columns :' + JSON.stringify(this.columns));
            console.log('childRecFieldNames ' + this.childRecFieldNames);
            this.createEmptyRecords(this.recordCount); 
            this.childRecords = this.emptyRecords;
        })
        .catch(error=>{
            console.log('In error :' + JSON.parse(error));
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading fieldName Details',
                    message,
                    variant: 'error',
                }),
            );
        })  
    }

    createEmptyRecords(recordCount){
        console.log('In CreateEmptyRecords');
        this.emptyRecords=[];
        this.emptyRecords = Array.from({ length: recordCount }, () => {
            const row = {};
            this.childRecFieldNames.forEach(field => {
                 row[field] = '';
            });
        return row;
        });
        console.log('emptyRecords :' + JSON.stringify(this.emptyRecords));
    }

    handleDTSave(event){
        this.saveDraftValues = event.detail.draftValues;
        console.log('draftValues :' + JSON.stringify(this.saveDraftValues));
        this.disCreate = false;
    }

    handleCreate(){
        console.log('In Handle Create');

        createChildRecords({lstChildRecords : this.saveDraftValues, parObjectName: this.objectApiName, ObjectName : this.selObjectName, parRecordId : this.recordId})
        .then(response=>{
            this.savedChildRecords = response;
            console.log('After Apex Call :' + JSON.stringify(this.savedChildRecords));
            this.saveDraftValues=[];
            this.showRecordCreated = true;
        })
        .catch(error=>{
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
        }
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error in saving the Product Details',
                message,
                variant: 'error',
            }),
        );
        })
    }
}