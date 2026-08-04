import { Modal } from "bootstrap";

export default class PotamapLanding {

    // roll/bump this number up to force a display of the landing modal info box
    private expectedLanding = 7;

    constructor() {
    }

    public initializeAndShow() {
        const lsVal = localStorage.getItem('showLanding');
        if (lsVal === null) {
            this.showLandingModal();
        } else {
            const val = Number(lsVal);
            if (Number.isNaN(val)) {
                this.showLandingModal();
            } else if (val < this.expectedLanding) {
                this.showLandingModal();
            }
        }
    }

    private showLandingModal() {
        const myModalEl = document.getElementById('landingModal');

        if (myModalEl) {
            const myModal = new Modal(myModalEl);
            myModal.toggle();
            localStorage.setItem('showLanding', this.expectedLanding.toString());
        }
    }
}