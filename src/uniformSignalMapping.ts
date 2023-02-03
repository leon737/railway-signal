export interface Uniform5SignalMapping {
    code: string;
    canPass?: boolean;
    blocks: number;
    divert?: boolean;
    announce?: number;
    slow?: boolean;
    grade?: boolean;
    onTime?: boolean;
    timer?: boolean;
}

export const Uniform5Mapping: Uniform5SignalMapping[] = [
    {code: 'xxRxx', blocks: 0},
    {code: 'RxRxx', blocks: 0, timer: true},
    {code: 'xxrxx', blocks: 1},
    {code: 'Rxrxx', blocks: 1, divert: true},
    {code: 'rxRxx', blocks: 0, canPass: true},
    {code: 'rxrxx', blocks: 1, announce: 1},
    {code: 'xxxxY', blocks: 2},
    {code: 'xxRxY', blocks: 2, divert: true},
    {code: 'RxRxY', blocks: 2, slow: true},
    {code: 'xxrxY', blocks: 2, announce: 1},
    {code: 'RxrxY', blocks: 2, divert: true, announce: 1},
    {code: 'rxrxY', blocks: 2, grade: true},
    {code: 'xYxxY', blocks: 2, onTime: true},
    {code: 'xxxxy', blocks: 3},
    {code: 'xxRxy', blocks: 3, divert: true},
    {code: 'RxRxy', blocks: 3, slow: true},
    {code: 'xxrxy', blocks: 3, announce: 1},
    {code: 'Rxrxy', blocks: 3, divert: true, announce: 1},
    {code: 'rxrxy', blocks: 3, grade: true},
    {code: 'xYxxy', blocks: 3, onTime: true},
    {code: 'xyxxy', blocks: 3, announce: 2},
    {code: 'xxxGx', blocks: 4},
    {code: 'RxxGx', blocks: 4, divert: true},
    {code: 'rxxGx', blocks: 4, announce: 1},
    {code: 'xYxGx', blocks: 4, announce: 2},
    {code: 'xyxGx', blocks: 4, announce: 3},
    {code: 'xxxgx', blocks: 5},
    {code: 'Rxxgx', blocks: 5, divert: true},
    {code: 'rxxgx', blocks: 5, announce: 1},
    {code: 'xYxgx', blocks: 5, announce: 2},
    {code: 'xyxgx', blocks: 5, announce: 3}
]