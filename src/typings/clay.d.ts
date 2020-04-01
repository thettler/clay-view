import { Component } from 'vue';

export interface ClayNode {
    component: string | Component
    namespace: string
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
    ':key'?: string
    ref?: string
    refInFor?: boolean
    for?: any[] | { [key: string]: any }
    ':for'?: string
    on?: {
        [key: string]: ClayEvent;
    }
    nativeOn?: {
        [key: string]: ClayEvent;
    }
    data?: { [key: string]: any }
    scopedSlots?: {
        [key: string]: ClayNode;
    }
}

export type ClayEvent = Function | string;

export interface StorageDriver {
    get(key: string, options?: any): any;
}

export interface ClayConfig {
    enableJsExecution: boolean
}
