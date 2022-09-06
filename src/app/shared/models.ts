export interface Square {
    value: number;
    color: 'black' | 'red' | 'green';
}

export interface SquareStat {
    square: Square;
    count: number;
}