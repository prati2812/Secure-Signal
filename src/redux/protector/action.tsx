export const POLICE_STATIONS_DATA = 'POLICE_STATIONS_DATA';
export const PROTECTOR_STATION_DATA = 'PROTECTOR_STATION_DATA';



export const addProtectorData = (protectorData:object) => ({
    type: PROTECTOR_STATION_DATA,
    payload: protectorData,
})