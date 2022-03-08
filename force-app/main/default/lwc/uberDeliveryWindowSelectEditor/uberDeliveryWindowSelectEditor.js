import { LightningElement, api } from 'lwc';

export default class DeliveryOptionsCPE extends LightningElement {
    _inputVariables = [];

    @api
    get inputVariables() {
        //console.log('inputVariables getter: ' + JSON.stringify(this._inputVariables));
        return this._inputVariables;
    }

    // Set a field with the data that was stored from the flow.
    // This data includes the public volume property of the custom volume      
    // component.
    set inputVariables(variables) {
        //console.log('setter');
        this._inputVariables = variables || [];
    }

    //@api
    //deliveryDistanceLimit = 10;

    get deliveryWindowAllOptions() {
        return [
            { label: '10:30 am - 12:30 pm', value: '10:30 am - 12:30 pm' },
            { label: '12:00 pm - 02:00 pm', value: '12:00 pm - 02:00 pm' },
            { label: '01:00 pm - 03:00 pm', value: '01:00 pm - 03:00 pm' },
            { label: '03:00 pm - 05:00 pm', value: '03:00 pm - 05:00 pm' },
            { label: '07:00 pm - 09:00 pm', value: '07:00 pm - 09:00 pm' },
            { label: '09:00 pm - 11:00 pm', value: '09:00 pm - 11:00 pm' }
        ];
    }

    /*@api
    deliveryWindowOptionsSelected = [
        '10:30 am - 12:30 pm',
        '12:00 pm - 02:00 pm',
        '01:00 pm - 03:00 pm',
        '03:00 pm - 05:00 pm'
    ];*/

    //@api
    //defaultDeliveryWindowValue = '01:00 pm - 03:00 pm';

    // Get the value of the volume input variable.
    get deliveryDistanceLimit() {
        //console.log('inputVariablesDist: ' + JSON.stringify(this.inputVariables));
        const param = this.inputVariables.find(({name}) => name === 'deliveryDistanceLimit');
        //console.log('distance getter: ' + JSON.stringify(param));
        if (!param) {
            return 10; // Default value is 10
        }
        return param && param.value;
    }

    get deliveryWindowOptions() {
        //console.log('inputVariablesOpsSelected: ' + JSON.stringify(this.inputVariables));
        const param = this.inputVariables.find(({name}) => name === 'deliveryWindowOptions');
        //console.log('options getter: ' + JSON.stringify(param));
        //console.log(typeof param);
        if (!param || !param.value) {
            //console.log('inside !param');
            return [
                '10:30 am - 12:30 pm',
                '12:00 pm - 02:00 pm',
                '01:00 pm - 03:00 pm',
                '03:00 pm - 05:00 pm',
                '07:00 pm - 09:00 pm',
                '09:00 pm - 11:00 pm'
            ]; // Default value
        } else {
            // Need to stringify the param.value in order for it to save and persist the array of values for a multi-select input
            const stringifiedParamValue = JSON.stringify(param.value);
            //console.log(stringifiedParamValue);
            return param && stringifiedParamValue;
        }
    }

    get deliveryWindowValue() {
        //console.log('inputVariablesDefaultVal: ' + JSON.stringify(this.inputVariables));
        const param = this.inputVariables.find(({name}) => name === 'deliveryWindowValue');
        //console.log('defaultVal getter: ' + JSON.stringify(param));
        //console.log(typeof param);
        if (!param) {
            return '10:30 am - 12:30 pm';
        }
        return param && param.value;
    }

    @api
    validate() {
        const deliveryDistanceLimitComponent = this.template.querySelector('lightning-slider');
        const validity = [];
        if (this.volume < 0 || this.volume > 25) {
            deliveryDistanceLimitComponent.setCustomValidity('The slider range must be between 0 and 25.');
            validity.push({
                key: 'Slider Range',
                errorString: 'The slider range must be between 0 and 25.',
            });
        } else {
            deliveryDistanceLimitComponent.setCustomValidity('');
        }
        deliveryDistanceLimitComponent.reportValidity();
        return validity;
    }
    // Separate handler for each input, so that we can identify each by name and pass that information along to the main "handleChange" function
    handleDeliveryDistanceLimitChange(event) {
        this.handleChange(event, 'deliveryDistanceLimit', 'Number');
    }

    handleDeliveryWindowOptionsSelectedChange(event) {
        this.handleChange(event, 'deliveryWindowOptions', 'String');
    }

    handleDefaultDeliveryWindowValueChange(event) {
        this.handleChange(event, 'deliveryWindowValue', 'String');
    }

    handleChange(event, name, dataType) {
        if (event && event.detail) {
            //console.log('handleChange: ' + event + name + dataType);
            let newValue = event.detail.value;
            if (name === 'deliveryWindowOptions') {
                newValue = JSON.stringify(newValue);
            }
            console.log(newValue + typeof newValue);
            console.log(newValue);
            
            // this[name] = newValue;
            const valueChangedEvent = new CustomEvent(
                'configuration_editor_input_value_changed', {
                     bubbles: true,
                     cancelable: false,
                     composed: true,
                     detail: {
                         name: name,
                         newValue: newValue ? newValue : null,
                         newValueDataType: dataType
                     }
                }
            );
            this.dispatchEvent(valueChangedEvent);
            //console.log('event published');
        }
    }
}