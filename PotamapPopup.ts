import { MapBrowserEvent } from "ol";
import Overlay from "ol/Overlay";
import { FeatureLike } from "ol/Feature";

export default class PotamapPopup {
    private element: HTMLElement | null = null;
    private title: HTMLElement;
    private popup: Overlay | null = null;
    private otherLayers: HTMLElement;
    private otherLayersTitle: HTMLElement;

    constructor() {
        this.element = document.getElementById('pm-popup')!;
        this.title = document.getElementById('pm-pota-title')!;
        this.otherLayers = document.getElementById('pm-other-layers')!;
        this.otherLayersTitle = document.getElementById('pm-other-layers-title')!;

        this.popup = new Overlay({
            element: this.element,
            positioning: 'bottom-center',
            stopEvent: true
        });

        console.log("PotamapPopup", this.element);
    }

    public getPopupOverlay(): Overlay {
        return this.popup!;
    }

    public showPopup(
        event: MapBrowserEvent<PointerEvent | KeyboardEvent | WheelEvent>,
        clickedFeatures: FeatureLike[]) {

        // clear out old data            
        this.otherLayers.replaceChildren();
        this.title.innerHTML = '';

        if (clickedFeatures.length == 0) {
            this.hidePopup();
            return;
        }

        // filter out the geolocation position markers
        const toParse =
            clickedFeatures.filter((x) => x.get('NAME') !== 'accuracy_feat' && x.get('NAME') !== 'pos_feat');

        if (toParse.length == 0) {
            this.hidePopup();
            return;
        }

        // remove pota layer but keep rest of layers in toParse
        const idx = toParse.findIndex((x) => x.get('TITLE') !== undefined);

        if (idx !== -1) {
            const pota = toParse.splice(idx, 1)[0];
            if (pota)
                this.title.innerHTML = `${pota?.get('NAME')} - ${pota?.get('TITLE')}`;
        }

        if (toParse.length == 0) {
            this.otherLayersTitle.hidden = true;
            this.otherLayers.hidden = true;
        } else {
            this.otherLayersTitle.hidden = false;
            this.otherLayers.hidden = false;
        }

        toParse.forEach(element => {
            const html = this.parseOtherLayer(element);
            const t = document.createElement("template");
            t.innerHTML = html.trim();
            // console.log(t.content);
            const divEle = t.content.querySelector('.pm-shape-layer') as HTMLDivElement;
            // console.log(divEle);
            this.otherLayers.appendChild(divEle);
        });

        this.popup?.setPosition(event.coordinate);
    }

    public hidePopup() {
        this.popup?.setPosition(undefined);
    }

    private parseOtherLayer(feature: FeatureLike) {
        let shapeTitle = '';
        let res = '';

        const p = feature.getProperties();

        for (var property in p) {
            if (typeof (p[property]) == "string") {
                if (property === "NAME" || property === "name") {
                    const n = p["NAME"] ?? p["name"];
                    shapeTitle = n;
                    continue;
                }

                const propName = property;
                const propVal = p[property];
                res += this.getShapeProp(propName, propVal);
            }
        }

        return this.getLayerTemplate(shapeTitle, res);
    }

    private getLayerTemplate(name: string, res: string) {
        return `
        <div class="pm-shape-layer">
            <div class="pm-shape-name">${name}</div>
            <div class="pm-shape-props">
                ${res}
            </div>
        </div>`;
    }

    private getShapeProp(name: string, value: string) {
        return `<div class="pm-shape-prop">${name} : ${value}</div>`
    }
}