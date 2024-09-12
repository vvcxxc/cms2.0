
export interface IPeriod {
    name: string
    type: string
    startTime: string
    endTime: string
}

export interface IErrorItem {
    field: string
    message: string
}

export interface IMsgState {
    index: number
    [key: string]: string | number
}