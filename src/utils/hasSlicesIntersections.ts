import { Slice } from '../typings/Slice';
import { isPointInSlice } from './isPointInSlice';

export function hasSlicesIntersections(firstLine: Slice,
                                secondLine: Slice): boolean {
    return isPointInSlice(firstLine.start, secondLine)
        || isPointInSlice(firstLine.end, secondLine)
        || isPointInSlice(secondLine.start, firstLine);
}
