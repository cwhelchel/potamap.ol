
type PotamapQueryParams = {
    selectedState?: string | null;
};

export default class QueryParams {

    private data: PotamapQueryParams;

    constructor(search: string) {
        const params = new URLSearchParams(search);

        this.data = {
            selectedState: params.get("state")
        }
    }

    public get selectedState() : string | null {
        return this.data.selectedState || null;
    }
}