import * as React from "react";

export interface Props {
    value: any[],
    defaultValue: any[],
    options: any[],
    onChange: (value: any, selectedOptions: object) => void,
    onPopupVisibleChange: (visible: boolean) => void,
    onItemClick: (selectedOptions: object) => void,
    popupVisible: boolean,
    disabled: boolean,
    transitionName: string,
    popupClassName: string,
    popupPlacement: string,
    prefixCls: string,
    dropdownMenuColumnStyle: object,
    builtinPlacements: object,
    loadData: (selectedOptions: object, done: () => void) => void,
    changeOnSelect: boolean,
    children: React.ReactNode,
    onKeyDown: PropTypes.func,
    expandTrigger: string,
    fieldNames: object,
    filedNames: object,
    expandIcon: React.ReactNode,
    getPopupContainer: (trigger: React.ReactNode) => React.ReactNode
    loadingIcon: React.ReactNode,
    noData: string,
    stepModel: boolean,
    steps: object,
    onlyMenu: boolean,
}

export default class Cascader extends React.Component<Props> {};