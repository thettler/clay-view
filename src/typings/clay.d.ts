import { Component } from 'vue';

export interface ClayNode {
    component: string | Component
    clayKey: string
    children?: ClayNode[] | ClayNode
    'text'?: string
    ':text'?: string
    class?: { [key: string]: boolean } | string[] | string
    ':class'?: string
    if?: boolean
    ':if'?: string
    show?: boolean
    ':show'?: string
    style?: { [key: string]: string }
    attrs?: { [key: string]: string }
    props?: { [key: string]: any }
    domProps?: { [key: string]: any }
    slot?: string
    key?: string
    ref?: string
    refInFor?: boolean
    on?: {
        [key: string]: ClayEvent;
    }
    nativeOn?: {
        [key: string]: ClayEvent;
    }
    data?: { [key: string]: any }
    scopedSlots?: {
        [key: string]: ClayScopedSlot;
    }
}

export type ClayEvent = Function | string;

export interface StorageDriver {
    get(key: string, options?: any): any;

    set(key: string, value: any, options?: any): void;
}

export interface ClayScopedSlot {
    key: string
    content: ClayNode
}
