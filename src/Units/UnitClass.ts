import * as React from 'react';
import { Unit, UnitName } from '../Store/MyasoStore';

export abstract class UnitClass<T extends UnitName> extends React.Component<Unit<T>> {
}

export interface UnitClassConstructor<T extends UnitName> {
    new(props: Unit<T>): UnitClass<T>;
}