/* eslint-disable default-case */
import * as React from 'react';
import classNames from 'classnames';
import KeyCode from 'rc-util/lib/KeyCode';
import type {
  OptionListProps as SelectOptionListProps,
  RefOptionListProps,
} from 'rc-select/lib/OptionList';
import { SelectContext } from 'rc-tree-select/lib/Context';
import type { OptionDataNode } from '../interface';
import Column from './Column';
import { isLeaf, restoreCompatibleValue } from '../util';
import CascaderContext from '../context';
import useSearchResult from '../hooks/useSearchResult';

type OptionListProps = SelectOptionListProps<OptionDataNode[]> & { prefixCls: string };
export type FlattenOptions = OptionListProps['flattenOptions'];

const RefOptionList = React.forwardRef<RefOptionListProps, OptionListProps>((props, ref) => {
  const {
    prefixCls,
    options,
    onSelect,
    multiple,
    open,
    flattenOptions,
    searchValue,
    onToggleOpen,
    notFoundContent,
    direction,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>();
  const rtl = direction === 'rtl';

  const { checkedKeys, halfCheckedKeys } = React.useContext(SelectContext);
  const {
    changeOnSelect,
    expandTrigger,
    fieldNames,
    loadData,
    search,
    dropdownPrefixCls,
    noData,
    onItemClick,
  } = React.useContext(CascaderContext);

  const mergedPrefixCls = dropdownPrefixCls || prefixCls;

  // ========================= loadData =========================
  const [loadingKeys, setLoadingKeys] = React.useState([]);
  const [targetOption, setTargetOption] = React.useState(null);

  // ========================== Values ==========================
  const checkedSet = React.useMemo(() => new Set(checkedKeys), [checkedKeys]);
  const halfCheckedSet = React.useMemo(() => new Set(halfCheckedKeys), [halfCheckedKeys]);

  const internalLoadData = (pathValue: React.Key) => {
    // Do not load when search
    if (!loadData || searchValue) {
      return;
    }

    const entity = flattenOptions.find(flattenOption => flattenOption.data.value === pathValue);

    if (entity) {
      const { options: optionList } = restoreCompatibleValue(entity as any, fieldNames);
      const rawOptionList = optionList.map(opt => opt.node);

      const _targetOption = rawOptionList[rawOptionList.length - 1];

      setTargetOption(_targetOption);

      if (!isLeaf(entity.data.node as any)) {
        setLoadingKeys(keys => [...keys, entity.key]);

        const done = () => {
          // 如果当前节点的 children 为空数组，而且 noData 设置为不显示空子节点，需要直接隐藏浮层
          if (noData === null && _targetOption?.children && _targetOption?.children?.length === 0) {
            onSelect(pathValue, { selected: !checkedSet.has(pathValue) });
            onToggleOpen(false);
          }
        };

        loadData(rawOptionList, done);
      }
    }
  };

  // zombieJ: This is bad. We should make this same as `rc-tree` to use Promise instead.
  React.useEffect(() => {
    if (loadingKeys.length) {
      loadingKeys.forEach(loadingKey => {
        const option = flattenOptions.find(opt => opt.value === loadingKey);
        if (!option || option.data.children || option.data.isLeaf === true) {
          setLoadingKeys(keys => keys.filter(key => key !== loadingKey));
        }
      });
    }
  }, [flattenOptions, loadingKeys]);

  // =========================== Open ===========================
  const [openFinalValue, setOpenFinalValue] = React.useState<React.Key>(null);

  const mergedOpenPath = React.useMemo<React.Key[]>(() => {
    if (searchValue) {
      return openFinalValue !== undefined && openFinalValue !== null ? [openFinalValue] : [];
    }

    const entity = flattenOptions.find(
      flattenOption => flattenOption.data.value === openFinalValue,
    );

    if (entity) {
      const { path } = restoreCompatibleValue(entity as any, fieldNames);
      return path;
    }

    return [];
  }, [openFinalValue, flattenOptions, searchValue]);

  React.useEffect(() => {
    if (open) {
      let nextOpenPath: React.Key = null;

      if (!multiple && checkedKeys.length) {
        const entity = flattenOptions.find(
          flattenOption => flattenOption.data.value === checkedKeys[0],
        );

        if (entity) {
          nextOpenPath = entity.data.value;
        }
      }
      setOpenFinalValue(nextOpenPath);
    }
  }, [open]);

  // =========================== Path ===========================
  const onPathOpen = (index: number, pathValue: React.Key) => {
    setOpenFinalValue(pathValue);

    const entity = flattenOptions.find(flattenOption => flattenOption.data.value === pathValue);

    if (!entity) {
      return;
    }

    const { options: optionList } = restoreCompatibleValue(entity as any, fieldNames);
    const rawOptionList = optionList.map(opt => opt.node);

    // 只针对单选
    if (!multiple && onItemClick) {
      onItemClick(rawOptionList);
    }

    // Trigger loadData
    internalLoadData(pathValue);
  };

  const onPathSelect = (pathValue: React.Key, leaf: boolean) => {
    onSelect(pathValue, { selected: !checkedSet.has(pathValue) });

    if (!multiple && (leaf || (changeOnSelect && expandTrigger === 'hover'))) {
      onToggleOpen(false);
    }
  };

  const getPathList = (pathList: React.Key[]) => {
    let currentOptions = options;

    for (let i = 0; i < pathList.length; i += 1) {
      currentOptions = (currentOptions || []).find(option => option.value === pathList[i]).children;
    }

    return currentOptions;
  };

  // ========================== Search ==========================
  const searchOptions = useSearchResult({
    ...props,
    prefixCls: mergedPrefixCls,
    fieldNames,
    changeOnSelect,
    searchConfig: search,
  });

  // ========================== Column ==========================
  const optionColumns = React.useMemo(() => {
    if (searchValue) {
      return [
        {
          options: searchOptions,
        },
      ];
    }

    const rawOptionColumns: {
      options: OptionDataNode[];
    }[] = [];

    for (let i = 0; i <= mergedOpenPath.length; i += 1) {
      const subOptions = getPathList(mergedOpenPath.slice(0, i));

      /**
       * fix(2.3.3版本存在的问题)：
       * 修复当前节点的 children 为空时，选中后再次展开时，依然会渲染下一级面板的问题
       * */
      if (!subOptions?.length) {
        // 显示空节点
        if (noData && targetOption?.children && targetOption?.children?.length === 0) {
          const noDataList: OptionDataNode[] = [
            {
              title: noData,
              value: '__NO_DATA__',
              disabled: true,
              node: null,
            },
          ];
          rawOptionColumns.push({
            options: noDataList,
          });
        }
        break;
      }

      rawOptionColumns.push({
        options: subOptions,
      });
    }

    return rawOptionColumns;
  }, [searchValue, searchOptions, mergedOpenPath]);

  // ========================= Keyboard =========================
  const getActiveOption = (activeColumnIndex: number, offset: number) => {
    const pathActiveValue = mergedOpenPath[activeColumnIndex];
    const currentOptions = optionColumns[activeColumnIndex]?.options || [];
    let activeOptionIndex = currentOptions.findIndex(opt => opt.value === pathActiveValue);

    const len = currentOptions.length;

    // Last one is special since -1 may back 2 offset
    if (offset === -1 && activeOptionIndex === -1) {
      activeOptionIndex = len;
    }

    for (let i = 1; i <= len; i += 1) {
      const current = (activeOptionIndex + i * offset + len) % len;
      const option = currentOptions[current];

      if (!option.disabled) {
        return option;
      }
    }

    return null;
  };

  const prevColumn = () => {
    if (mergedOpenPath.length <= 1) {
      onToggleOpen(false);
    }
    setOpenFinalValue(mergedOpenPath[mergedOpenPath.length - 2]);
  };

  const nextColumn = () => {
    const nextColumnIndex = mergedOpenPath.length;
    const nextActiveOption = getActiveOption(nextColumnIndex, 1);
    if (nextActiveOption) {
      onPathOpen(nextColumnIndex, nextActiveOption.value);
    }
  };

  React.useImperativeHandle(ref, () => ({
    // scrollTo: treeRef.current?.scrollTo,
    onKeyDown: event => {
      const { which } = event;

      switch (which) {
        // >>> Arrow keys
        case KeyCode.UP:
        case KeyCode.DOWN: {
          let offset = 0;
          if (which === KeyCode.UP) {
            offset = -1;
          } else if (which === KeyCode.DOWN) {
            offset = 1;
          }

          if (offset !== 0) {
            const activeColumnIndex = Math.max(mergedOpenPath.length - 1, 0);
            const nextActiveOption = getActiveOption(activeColumnIndex, offset);
            if (nextActiveOption) {
              const ele = containerRef.current?.querySelector(
                `li[data-value="${nextActiveOption.value}"]`,
              );
              ele?.scrollIntoView?.({ block: 'nearest' });

              onPathOpen(activeColumnIndex, nextActiveOption.value);
            }
          }

          break;
        }

        case KeyCode.LEFT: {
          if (rtl) {
            nextColumn();
          } else {
            prevColumn();
          }
          break;
        }

        case KeyCode.RIGHT: {
          if (rtl) {
            prevColumn();
          } else {
            nextColumn();
          }
          break;
        }

        case KeyCode.BACKSPACE: {
          if (!searchValue) {
            prevColumn();
          }
          break;
        }

        // >>> Select
        case KeyCode.ENTER: {
          const lastValue = mergedOpenPath[mergedOpenPath.length - 1];
          const option = optionColumns[mergedOpenPath.length - 1]?.options?.find(
            opt => opt.value === lastValue,
          );

          // Skip when no select
          if (option) {
            const leaf = isLeaf(option);

            if (multiple || changeOnSelect || leaf) {
              onPathSelect(lastValue, leaf);
            }

            // Close for changeOnSelect
            if (changeOnSelect) {
              onToggleOpen(false);
            }
          }
          break;
        }

        // >>> Close
        case KeyCode.ESC: {
          onToggleOpen(false);

          if (open) {
            event.stopPropagation();
          }
        }
      }
    },
    onKeyUp: () => {},
  }));

  // ========================== Render ==========================
  const columnProps = {
    ...props,
    onOpen: onPathOpen,
    onSelect: onPathSelect,
    onToggleOpen,
    checkedSet,
    halfCheckedSet,
    loadingKeys,
  };

  // >>>>> Empty
  const isEmpty = !optionColumns[0]?.options?.length;

  const emptyList: OptionDataNode[] = [
    {
      title: notFoundContent,
      value: '__EMPTY__',
      disabled: true,
      node: null,
    },
  ];

  // >>>>> Columns
  const mergedOptionColumns = isEmpty ? [{ options: emptyList }] : optionColumns;

  const columnNodes: React.ReactElement[] = mergedOptionColumns.map((col, index) => (
    <Column
      key={index}
      index={index}
      {...columnProps}
      isEmpty={isEmpty}
      prefixCls={mergedPrefixCls}
      options={col.options}
      openKey={mergedOpenPath[index]}
    />
  ));

  // >>>>> Render
  return (
    <>
      <div
        className={classNames(`${mergedPrefixCls}-menus`, {
          [`${mergedPrefixCls}-menu-empty`]: isEmpty,
          [`${mergedPrefixCls}-rtl`]: rtl,
        })}
        ref={containerRef}
      >
        {columnNodes}
      </div>
    </>
  );
});

export default RefOptionList;
