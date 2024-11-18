
export default class LocData {
    // !!! reminder put POTA PARK marker layer LAST so it shows up on top of 
    // boundary geometry !!
    static data = {
        'data':
        {
            'US-AK': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateAK.geojson' },
                { title: 'Parks', file: 'parks-US-AK.geojson' },
            ],
            'US-AL': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateAL.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-AL.geojson' },
            ],
            'US-AR': [
                { title: 'PAD-US Des', file: 'PADUS3_0Designation_StateAR.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateAR.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-AR.geojson' },
            ],
            'US-AZ': [
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateAZ.geojson' },
                { title: 'Parks', file: 'parks-US-AZ.geojson' },
            ],
            'US-CA': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateCA.geojson' },
                { title: 'Parks', file: 'parks-US-CA.geojson' },
            ],
            'US-CO': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateCO.geojson' },
                { title: 'Parks', file: 'parks-US-CO.geojson' },
            ],
            'US-CT': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS4_0_State_CT.geojson' },
                { title: 'Parks', file: 'parks-US-CT.geojson' },
            ],
            'US-DC': [
                { title: 'WARO NHT', file: '..\/US-common\/waro.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateDC.geojson' },
                { title: 'Parks', file: 'parks-US-DC.geojson' },
            ],
            'US-DE': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateDE.geojson' },
                { title: 'Parks', file: 'parks-US-DE.geojson' },
            ],
            'US-FL': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateFL.geojson' },
                { title: 'FL NST', file: 'fl_nst2.geojson' },
                { title: 'Parks', file: 'parks-US-FL.geojson' },
            ],
            'US-GA': [
                { title: 'Counties', file: 'counties.geojson' },
                { title: 'GA DNR', file: 'new_dnr20a.geojson' },
                { title: 'PAD-US', file: 'new_PAD1.geojson' },
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-GA.geojson' }
            ],
            'US-HI': [
                { title: 'PAD-US', file: 'PADUS4_0_StateHI.geojson' },
                { title: 'Parks', file: 'parks-US-HI.geojson' },
            ],
            'US-IA': [
                { title: 'LC NHT', file: '..\/US-common\/lc_nht.geojson' },
                { title: 'MP NHT', file: '..\/US-common\/Mormon_Pioneer_NHT.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateIA.geojson' },
                { title: 'Parks', file: 'parks-US-IA.geojson' },
            ],
            'US-ID': [
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateID.geojson' },
                { title: 'Parks', file: 'parks-US-ID.geojson' },
            ],
            'US-IL': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateIL.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-IL.geojson' },
            ],
            'US-IN': [
                { title: 'PAD-US', file: 'PADUS4_0_StateIN.geojson' },
                { title: 'Parks', file: 'parks-US-IN.geojson' },
            ],
            'US-KH': [
                { title: 'Parks', file: 'parks-US-KH1.geojson' },
            ],
            'US-KP': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StatePR.geojson' },
                { title: 'Parks KP4', file: 'parks-US-KP4.geojson' },
                { title: 'Parks KP1', file: 'parks-US-KP1.geojson' },
                { title: 'Parks KP5', file: 'parks-US-KP5.geojson' },
            ],
            'US-KS': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateKS.geojson' },
                { title: 'PE NHT', file: '..\/US-common\/Pony_Express_NHT.geojson' },
                { title: 'LC NHT', file: '..\/US-common\/lc_nht.geojson' },
                { title: 'SAFE NHT', file: '..\/US-common\/safe.geojson' },
                { title: 'Parks', file: 'parks-US-KS.geojson' },
            ],
            'US-KY': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateKY.geojson' },
                { title: 'LC NHT', file: '..\/US-common\/lc_nht.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-KY.geojson' },
            ],
            'US-LA': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateLA.geojson' },
                { title: 'Parks', file: 'parks-US-LA.geojson' },
            ],
            'US-MA': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateMA.geojson' },
                { title: 'Parks', file: 'parks-US-MA.geojson' },
            ],
            'US-MD': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateMD.geojson' },
                { title: 'Parks', file: 'parks-US-MD.geojson' },
            ],
            'US-ME': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateME.geojson' },
                { title: 'Parks', file: 'parks-US-ME.geojson' },
            ],
            'US-MI': [
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateMI.geojson' },
                { title: 'Parks', file: 'parks-US-MI.geojson' },
            ],
            'US-MN': [
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'PAS-US Fee', file: 'PADUS4_0_StateMN.geojson' },
                { title: 'MNRRA', file: 'mnrra.geojson' },
                { title: 'Parks', file: 'parks-US-MN.geojson' },
            ],
            'US-MO': [
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'SAFE NHT', file: '..\/US-common\/safe.geojson' },
                { title: 'PAS-US Fee', file: 'PADUS3_0Fee_StateMO.geojson' },
                { title: 'Parks', file: 'parks-US-MO.geojson' },
            ],
            'US-MS': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateMS.geojson' },
                { title: 'Parks', file: 'parks-US-MS.geojson' },
            ],
            'US-MT': [
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateMT.geojson' },
                { title: 'Parks', file: 'parks-US-MT.geojson' },
            ],
            'US-NC': [
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateNC.geojson' },
                { title: 'Parks', file: 'parks-US-NC.geojson' },
            ],
            'US-ND': [
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateND.geojson' },
                { title: 'Parks', file: 'parks-US-ND.geojson' },
            ],
            'US-NE': [
                { title: 'MP NHT', file: '..\/US-common\/Mormon_Pioneer_NHT.geojson' },
                { title: 'LC NHT', file: '..\/US-common\/lc_nht.geojson' },
                { title: 'PE NHT', file: '..\/US-common\/Pony_Express_NHT.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateNE.geojson' },
                { title: 'Parks', file: 'parks-US-NE.geojson' },
            ],
            'US-NH': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateNH.geojson' },
                { title: 'Parks', file: 'parks-US-NH.geojson' },
            ],
            'US-NJ': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'WARO NHT', file: '..\/US-common\/waro.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateNJ.geojson' },
                { title: 'Parks', file: 'parks-US-NJ.geojson' },
            ],
            'US-NM': [
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateNM.geojson' },
                { title: 'Parks', file: 'parks-US-NM.geojson' },
            ],
            'US-NV': [
                { title: 'PE NHT', file: '..\/US-common\/Pony_Express_NHT.geojson' },
                { title: 'PAD-US Des', file: 'PADUS3_0Designation_StateNV.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateNV.geojson' },
                { title: 'Parks', file: 'parks-US-NV.geojson' },
            ],
            'US-NY': [
                { title: 'PAD-US', file: 'PADUS3_0Fee_StateNY.geojson' },
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'Parks', file: 'parks-US-NY.geojson' },
            ],
            'US-OH': [
                { title: 'Parks', file: 'parks-US-OH.geojson' },
            ],
            'US-OK': [
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateOK.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'Parks', file: 'parks-US-OK.geojson' },
            ],
            'US-OR': [
                { title: 'Parks', file: 'parks-US-OR.geojson' },
            ],
            'US-PA': [
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StatePA.geojson' },
                { title: 'Parks', file: 'parks-US-PA.geojson' },
            ],
            'US-RI': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateRI.geojson' },
                { title: 'Parks', file: 'parks-US-RI.geojson' },
            ],
            'US-SC': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateSC.geojson' },
                { title: 'Parks', file: 'parks-US-SC.geojson' },
            ],            
            'US-SD': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateSD.geojson' },
                { title: 'Parks', file: 'parks-US-SD.geojson' },
            ],
            'US-TN': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'TOT NHT', file: '..\/US-common\/tot.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateTN.geojson' },
                { title: 'Parks', file: 'parks-US-TN.geojson' },
            ],
            'US-TX': [
                { title: 'PAD-US', file: 'PADUS4_0Fee_StateTX.geojson' },
                { title: 'Parks', file: 'parks-US-TX.geojson' },
            ],
            'US-UT': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateUT.geojson' },
                { title: 'PAD-US Des', file: 'PADUS3_0Designation_StateUT.geojson' },
                { title: 'Parks', file: 'parks-US-UT.geojson' },
            ],
            'US-VA': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'PAD-US Des', file: 'PADUS4_0_StateVA_Desig.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS4_0_StateVA.geojson' },
                { title: 'Parks', file: 'parks-US-VA.geojson' },
            ],
            // no parks here 😢
            'US-VI': [
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateVI.geojson' },
                { title: 'Parks', file: 'parks-US-VI.geojson' },
            ],
            'US-VT': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateVT.geojson' },
                { title: 'Parks', file: 'parks-US-VT.geojson' },
            ],
            'US-WA': [
                { title: 'Parks', file: 'parks-US-WA.geojson' },
            ],
            'US-WI': [
                { title: 'NCT NST', file: '..\/US-common\/nct_nst.geojson' },
                { title: 'PAD-US Proc', file: 'PADUS3_0Proclamation_StateWI.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateWI.geojson' },
                { title: 'PAD-US Des', file: 'PADUS3_0Designation_StateWI.geojson' },
                { title: 'Parks', file: 'parks-US-WI.geojson' },
            ],
            'US-WV': [
                { title: 'AT', file: '..\/US-common\/at.geojson' },
                { title: 'LC NHT', file: '..\/US-common\/lc_nht.geojson' },
                { title: 'PAD-US Fee', file: 'PADUS3_0Fee_StateWV.geojson' },
                { title: 'Parks', file: 'parks-US-WV.geojson' },
            ],
            'US-WY': [
                { title: 'PAD-US', file: 'PADUS3_0Combined_StateWY.geojson' },
                { title: 'BLM', file: 'BLM_PADUS3_0Combined_StateWY.geojson' },
                { title: 'Parks', file: 'parks-US-WY.geojson' },
            ],
        }
    };
}
