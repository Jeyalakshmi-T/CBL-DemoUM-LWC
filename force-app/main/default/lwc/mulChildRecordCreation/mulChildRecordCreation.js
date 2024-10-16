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
    
    templateName;
    templateNameA = templateNameA;
    relObj=[];
    relObjName=[];
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
        } else if(error){
            console.log('In error :' + JSON.stringify(error));
        }
    }

    getChildObjectNames(){
        this.relObjName = [];
        for (let index = 0; index < this.relObj.length; index++) {
            this.relObjName.push({label : this.relObj[index], 
                                  value : this.relObj[index]});
        }
    }

    handleChange(event){
        this.selObjectName = event.target.value;
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
            this.templateName = this.templateNameA;
            this.getDisplayFields();
        }   
    }

    handleCancel() {
        this.dispatchEvent(new CloseActionScreenEvent());
        this.templateName ='';
    }

    handleDone(){
        this.savedChildRecords = [];
        this.showRecordCreated = false;
        this.dispatchEvent(new CloseActionScreenEvent());
        this.templateName =''; 
    }

    handleAddRow(){
        this.createEmptyRecords(this.addOneRec);
        this.childRecords.push(this.emptyRecords);
        this.childRecords = [...this.childRecords];
    }

    getDisplayFields(){
        getFieldNames({parObjectName:this.objectApiName,objectName : this.selObjectName})
        .then((data)=>{
            this.lstFields = data;
            for (let index = 0; index < this.lstFields.length; index++) { 
                this.childRecFieldNames.push(Object.values(this.lstFields[index])[0]);
            }
            this.columns = this.lstFields.map(field => {
                const fldName = Object.values(field)[0];  
                const label = Object.keys(field)[0];  
                const fldType = Object.values(field)[1];
                return {
                    label: label,
                    fieldName: fldName,
                    type: fldType,
                    editable: true
                };
            });
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
        this.emptyRecords=[];
        this.emptyRecords = Array.from({ length: recordCount }, () => {
            const row = {};
            this.childRecFieldNames.forEach(field => {row[field] = '';});
            return row;
        });
    }

    handleDTSave(event){
        this.saveDraftValues = event.detail.draftValues;
        this.disCreate = false;
    }

    handleCreate(){
        createChildRecords({lstChildRecords : this.saveDraftValues, parObjectName: this.objectApiName, ObjectName : this.selObjectName, parRecordId : this.recordId})
        .then(response=>{
            this.savedChildRecords = response;
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