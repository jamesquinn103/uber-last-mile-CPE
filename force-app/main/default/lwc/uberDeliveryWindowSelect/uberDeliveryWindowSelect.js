import { LightningElement, api } from 'lwc';

const CSS_CLASS = 'modal-hidden';

export default class DeliveryTypeAndWindowChoice extends LightningElement {

    @api
    deliveryDistanceLimit;

    @api
    deliveryTypeValue;

    @api
    get deliveryTypeOptions() {
        return [
            { label: 'Today (Delivers to ZIP CODE) UBER LOGO', value: 'Uber' }
        ];
    }
    showModal = false;

    @api
    deliveryWindowValue;

    deliveryWindowOptionsFromFlow;

    @api
    get deliveryWindowOptions() {
        // Our setter gives us a string
        let windowOptionsParse = JSON.parse(this.deliveryWindowOptionsFromFlow);
        // We have now parsed the string into an array of strings
        windowOptionsParse = windowOptionsParse.map((str, index) => ({ label: str, value: str }));
        // We have now mapped the array of strings into an array of objects that matches the below format
        return windowOptionsParse;
        /*return [
            { label: '10:30 am - 12:30 pm', value: '10:30 am - 12:30 pm' },
            { label: '12:00 pm - 02:00 pm', value: '12:00 pm - 02:00 pm' },
            { label: '01:00 pm - 03:00 pm', value: '01:00 pm - 03:00 pm' },
            { label: '03:00 pm - 05:00 pm', value: '03:00 pm - 05:00 pm' }
        ];*/
    }

    set deliveryWindowOptions(value) {
        // Receive a string from the Flow's Custom Property Editor
        this.deliveryWindowOptionsFromFlow = value;
    }

    @api
    get zipCode() {
        return '12345';
    }
    
    
    set header(value) {
        this.hasHeaderString = value !== '';
        this._headerPrivate = value;
    }
    get header() {
        return this._headerPrivate;
    }

    hasHeaderString = false;
    _headerPrivate;

    @api show() {
        //console.log('show modal');
        this.showModal = true;
    }

    @api hide() {
        //console.log('hide modal');
        this.showModal = false;
    }

    handleDeliveryTypeChange(event) {
        //console.log('Delivery Type Change handler invoked: ' +  event.detail.value);
        this.deliveryTypeValue = event.detail.value;
        //console.log('You chose: ' + this.deliveryTypeValue);
        // If the option selected is 'Uber'...
        if (this.deliveryTypeValue === 'Uber') {
            //Open modal and let parent know so it can set proper variables if needed
            const opendialog = new CustomEvent('opendialog');
            this.dispatchEvent(opendialog);
            this.show();
        }
        //console.log('End of handleDeliveryTypeChange');
    }

    handleDeliveryWindowChange(event) {
        //console.log('Delivery window handler invoked');
        //console.log('this.deliveryWindowValue: ' + this.deliveryWindowValue);
        this.deliveryWindowValue = event.detail.value;
        //console.log('You chose: ' + this.deliveryWindowValue);
        this.handleModalClose();
    }

    handleModalClose() {
        //Let parent know that modal is closed (either via cross button or delivery window option selection) so it can set proper variables if needed
        const closeModal = new CustomEvent('closeModal');
        this.dispatchEvent(closeModal);
        this.hide();
        //console.log('ModalClose , current value of deliveryTypeValue + Window: ' + this.deliveryTypeValue + this.deliveryWindowValue);
    }

    handleSlotTaglineChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        // Added to address Issue #344 where querySelector would intermittently return null element on hide
        if (this.showModal === false) {
            return;
        }
        const taglineEl = this.template.querySelector('p');
        taglineEl.classList.remove(CSS_CLASS);
    }

    handleSlotFooterChange() {
        // Only needed in "show" state. If hiding, we're removing from DOM anyway
        // Added to address Issue #344 where querySelector would intermittently return null element on hide
        if (this.showModal === false) {
            return;
        }
        const footerEl = this.template.querySelector('footer');
        footerEl.classList.remove(CSS_CLASS);
    }
}