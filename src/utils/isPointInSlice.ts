import { Slice } from '../typings/Slice';

export function isPointInSlice(point: number, line: Slice): boolean {
    return line.start < point && point < line.end;
}
