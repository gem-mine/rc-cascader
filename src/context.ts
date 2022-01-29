import * as React from 'react';
import type { CascaderProps } from './Cascader';
import type { ShowSearchType, DataNode } from './interface';

type ContextProps = Required<
  Pick<
    CascaderProps,
    | 'changeOnSelect'
    | 'expandTrigger'
    | 'fieldNames'
    | 'expandIcon'
    | 'loadingIcon'
    | 'loadData'
    | 'dropdownMenuColumnStyle'
  >
> & {
  search: ShowSearchType;
  dropdownPrefixCls?: string;
  noData?: string | null;
  onItemClick?: (selectOptions: DataNode[] | DataNode[][]) => void;
};

const CascaderContext = React.createContext<ContextProps>({
  changeOnSelect: false,
  expandTrigger: 'click',
  fieldNames: null,
  expandIcon: null,
  loadingIcon: null,
  loadData: null,
  dropdownMenuColumnStyle: null,
  search: null,
});

export default CascaderContext;
